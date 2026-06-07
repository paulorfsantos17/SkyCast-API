# outputs.tf

# Aqui depois vamos expor coisas úteis como:
# - nome do cluster
# - arn do cluster
# - ids de subnet
# - etc.

output "cluster_name" {
  description = "Nome do cluster EKS"
  value       = aws_eks_cluster.this.name
}

output "cluster_endpoint" {
  description = "Endpoint do servidor de API do Kubernetes"
  value       = aws_eks_cluster.this.endpoint
}

output "cluster_certificate_authority_data" {
  description = "Certificado da autoridade do cluster (base64)"
  value       = aws_eks_cluster.this.certificate_authority[0].data
}

