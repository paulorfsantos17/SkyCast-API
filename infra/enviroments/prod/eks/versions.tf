terraform {
  # Versão mínima do Terraform CLI
  required_version = ">= 1.5.0"

  # Provedores que este projeto usa
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}