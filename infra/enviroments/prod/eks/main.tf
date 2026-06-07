# Data source para obter as zonas de disponibilidade da região
# Isso nos permite criar subnets em diferentes AZs para alta disponibilidade

data "aws_availability_zones" "available" {
  state = "available"
}



# 1. Criação da VPC
# Esta é a sua rede isolada na AWS.
resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr # Usa o CIDR definido na variável

  enable_dns_hostnames = true # Permite que instâncias tenham nomes DNS públicos
  enable_dns_support   = true # Habilita o suporte a DNS na VPC

  tags = {
    Name = "${var.cluster_name}-vpc" # Tag para identificar a VPC
    # Tags especiais para o EKS - IMPORTANTES!
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
  }
}

# 2. Internet Gateway (IGW)
# Permite que a VPC se comunique com a internet. Essencial para subnets públicas.
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id # Associa ao ID da VPC que acabamos de criar

  tags = {
    Name = "${var.cluster_name}-igw"
  }
}


# 3. Subnets Públicas
# Onde recursos como Load Balancers (para seu frontend) e NAT Gateways vão residir.
resource "aws_subnet" "public" {
  count      = length(var.public_subnet_cidrs) # Cria uma subnet para cada CIDR na lista
  vpc_id     = aws_vpc.main.id
  cidr_block = var.public_subnet_cidrs[count.index]
  # Distribui as subnets pelas Zonas de Disponibilidade disponíveis
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true # Instâncias lançadas aqui recebem um IP público

  tags = {
    Name = "${var.cluster_name}-public-subnet-${count.index}"
    # Tags especiais para o EKS - IMPORTANTES!
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
    "kubernetes.io/role/elb"                    = "1" # Indica que esta subnet pode ser usada por ELBs
  }
}


# 4. Subnets Privadas
# Onde seus Pods (API, worker, mongo, rabbitmq) e os nós do EKS vão rodar. Mais seguro.
resource "aws_subnet" "private" {
  count      = length(var.private_subnet_cidrs) # Cria uma subnet para cada CIDR na lista
  vpc_id     = aws_vpc.main.id
  cidr_block = var.private_subnet_cidrs[count.index]
  # Distribui as subnets pelas Zonas de Disponibilidade disponíveis
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "${var.cluster_name}-private-subnet-${count.index}"
    # Tags especiais para o EKS - IMPORTANTES!
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
    "kubernetes.io/role/internal-elb"           = "1" # Indica que esta subnet pode ser usada por ELBs internos
  }
}

# 5. Elastic IP (EIP) para o NAT Gateway
# Um IP público estático necessário para o NAT Gateway.
resource "aws_eip" "nat" {
  count  = length(var.private_subnet_cidrs) # Um EIP por NAT Gateway (um por AZ para alta disponibilidade)
  domain = "vpc"
}

# 6. NAT Gateway
# Permite que as subnets privadas acessem a internet (para baixar imagens, etc.)
# sem que a internet possa iniciar conexões com elas.
resource "aws_nat_gateway" "main" {
  count         = length(var.private_subnet_cidrs)
  allocation_id = aws_eip.nat[count.index].id       # Associa o EIP criado
  subnet_id     = aws_subnet.public[count.index].id # O NAT Gateway deve estar em uma subnet pública

  tags = {
    Name = "${var.cluster_name}-nat-gw-${count.index}"
  }
  # Garante que o IGW esteja pronto antes de criar o NAT Gateway
  depends_on = [aws_internet_gateway.main]
}

# 7. Tabela de Rotas Pública
# Roteia o tráfego da internet para o Internet Gateway.
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"                  # Todo o tráfego para fora da VPC
    gateway_id = aws_internet_gateway.main.id # Vai para o Internet Gateway
  }

  tags = {
    Name = "${var.cluster_name}-public-rt"
  }
}


# 8. Associação da Tabela de Rotas Pública às Subnets Públicas
resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}



# 9. Tabela de Rotas Privada
# Roteia o tráfego para a internet através do NAT Gateway.
resource "aws_route_table" "private" {
  count  = length(var.private_subnet_cidrs)
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"                          # Todo o tráfego para fora da VPC
    nat_gateway_id = aws_nat_gateway.main[count.index].id # Vai para o NAT Gateway
  }

  tags = {
    Name = "${var.cluster_name}-private-rt-${count.index}"
  }
}



# 10. Associação da Tabela de Rotas Privada às Subnets Privadas
resource "aws_route_table_association" "private" {
  count          = length(aws_subnet.private)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}



# main.tf (adicione este conteúdo abaixo do código de rede)

# --- IAM Roles para o EKS ---

# 1. IAM Role para o EKS Cluster Service Role
# Esta role permite que o plano de controle do EKS gerencie recursos AWS em seu nome.
resource "aws_iam_role" "eks_cluster_role" {
  name = "${var.cluster_name}-eks-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com" # O serviço EKS pode assumir esta role
        }
        Action = "sts:AssumeRole"
      },
    ]
  })

  tags = {
    Name = "${var.cluster_name}-eks-cluster-role"
  }
}


# Anexa as políticas gerenciadas necessárias à EKS Cluster Service Role
resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy" # Permissões básicas para o cluster EKS
  role       = aws_iam_role.eks_cluster_role.name
}

resource "aws_iam_role_policy_attachment" "eks_vpc_cni_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController" # Permissões para o VPC CNI
  role       = aws_iam_role.eks_cluster_role.name
}

# 2. IAM Role para os EKS Node Group (Worker Nodes)
# Esta role é assumida pelas instâncias EC2 que serão os worker nodes do EKS.
resource "aws_iam_role" "eks_node_group_role" {
  name = "${var.cluster_name}-eks-node-group-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com" # Instâncias EC2 podem assumir esta role
        }
        Action = "sts:AssumeRole"
      },
    ]
  })

  tags = {
    Name = "${var.cluster_name}-eks-node-group-role"
  }
}

# Anexa as políticas gerenciadas necessárias à EKS Node Group Role
resource "aws_iam_role_policy_attachment" "eks_worker_node_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy" # Permissões básicas para worker nodes
  role       = aws_iam_role.eks_node_group_role.name
}

resource "aws_iam_role_policy_attachment" "eks_cni_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy" # Permissões para o plugin CNI da AWS
  role       = aws_iam_role.eks_node_group_role.name
}

resource "aws_iam_role_policy_attachment" "ec2_container_registry_readonly" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly" # Permite puxar imagens do ECR
  role       = aws_iam_role.eks_node_group_role.name
}


# --- Cluster EKS ---

resource "aws_eks_cluster" "this" {
  name     = var.cluster_name
  role_arn = aws_iam_role.eks_cluster_role.arn
  version  = "1.28" # ou outra versão suportada que você preferir

  vpc_config {
    subnet_ids = concat(
      aws_subnet.public[*].id,
      aws_subnet.private[*].id
    )

    endpoint_private_access = true
    endpoint_public_access  = true
  }

  # Garante que a VPC e as roles existam antes do cluster
  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy,
    aws_iam_role_policy_attachment.eks_vpc_cni_policy,
    aws_subnet.public,
    aws_subnet.private
  ]

  tags = {
    Name = var.cluster_name
  }
}

# --- Node Group (Worker Nodes do EKS) ---

resource "aws_eks_node_group" "this" {
  cluster_name    = aws_eks_cluster.this.name
  node_group_name = "${var.cluster_name}-node-group"
  node_role_arn   = aws_iam_role.eks_node_group_role.arn

  # Subnets onde os nós vão rodar (privadas é mais seguro; públicas também funciona para começar)
  subnet_ids = aws_subnet.private[*].id

  scaling_config {
    desired_size = 3 # quantidade de nós "alvo"
    max_size     = 5 # máximo de nós
    min_size     = 2 # mínimo de nós
  }

  # Tipo de instância dos nós
  ami_type = "AL2_x86_64" # ou AL2_x86_64_GPU, BOTTLEROCKET_x86_64

  instance_types = ["t3.medium"]

  # Versão do Kubernetes deve bater com a do cluster
  version = aws_eks_cluster.this.version

  # Labels opcionais para os nós, podem ajudar depois para agendamento de pods
  labels = {
    role = "worker"
  }

  # Tags em nível de EC2 (ajuda para billing e organização)
  tags = {
    Name = "${var.cluster_name}-node-group"
  }

  depends_on = [
    aws_eks_cluster.this,
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.ec2_container_registry_readonly
  ]
}
