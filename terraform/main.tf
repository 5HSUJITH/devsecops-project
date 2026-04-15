provider "aws" {
  region = "us-east-1"
}

# -------------------
# EC2 (Jenkins)
# -------------------
resource "aws_instance" "jenkins" {
  ami           = "ami-0c02fb55956c7d316"
  instance_type = "t2.medium"

  tags = {
    Name = "jenkins-server"
  }
}

# -------------------
# ECR
# -------------------
resource "aws_ecr_repository" "repo" {
  name = "devsecops-app"
}

# -------------------
# EKS (simplified placeholder)
# -------------------
resource "aws_eks_cluster" "eks" {
  name     = "devsecops-cluster"
  role_arn = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/eks-cluster-role"

  vpc_config {
    subnet_ids = []
  }
}

data "aws_caller_identity" "current" {}
