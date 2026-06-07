# variables.tf

# Região da AWS onde o cluster EKS e a infra serão criados
variable "aws_region" {
  description = "Região da AWS"
  type        = string
  default     = "us-east-1"
}

# Nome do cluster EKS
variable "cluster_name" {
  description = "Cluster SkyCast"


  type    = string
  default = "skycast-eks-prod"

}


variable "vpc_cidr" {
  description = "CIDR block para a VPC"
  type        = string
  default     = "10.0.0.0/16" # Um bloco grande para a VPC
}

variable "public_subnet_cidrs" {
  description = "Lista de CIDR blocks para as subnets públicas"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"] # Duas subnets em diferentes AZs para alta disponibilidade
}

variable "private_subnet_cidrs" {
  description = "Lista de CIDR blocks para as subnets privadas"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"] # Duas subnets em diferentes AZs para alta disponibilidade
}
