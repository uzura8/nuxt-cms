terraform {
  backend "s3" {
  }

  required_version = "~> 1.14.4" # 1.14.x のみ許可
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.32.0" # 6.31.x のみ許可
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.8.1" # 3.8.x のみ許可
    }
  }

  ## 最新安定版(1.14.4)以上、ただしメジャー2系には勝手に上がらないようにする
  #required_version = ">= 1.14.4, < 2.0.0"
  #required_providers {
  #  aws = {
  #    source = "hashicorp/aws"
  #    # 現時点の最新(6.31.0)以上、ただしメジャー7には勝手に上がらない
  #    version = ">= 6.31.0, < 7.0.0"
  #  }
  #  random = {
  #    source = "hashicorp/random"
  #    # 現時点の最新(3.8.1)以上、ただしメジャー4には勝手に上がらない
  #    version = ">= 3.8.1, < 4.0.0"
  #  }
  #}
}

#provider "aws" {
#  region = var.aws_region
#}
# provider "aws" {
#   region = var.region_api
#   alias  = "api"
#   # alias なし = default
# }

provider "aws" {
  region = var.region_site
  alias  = "site"
}

provider "aws" {
  region = var.region_acm
  alias  = "acm"
}

provider "aws" {
  region = var.region_lambda_edge
  alias  = "lambda_edge"
}

locals {
  name_prefix = "${var.project}-${var.stage}"

  fqdn = {
    #api         = var.domain_api
    static_site = var.domain_static_site
  }

  bucket = {
    static_site = local.fqdn.static_site
  }

  tags = {
    Project   = var.project
    Stage     = var.stage
    ManagedBy = "terraform"
  }
}

