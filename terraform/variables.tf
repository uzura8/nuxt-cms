# Project and stage variables
variable "project" {
  type    = string
  default = "example"
}
variable "stage" {
  type    = string
  default = "dev"
}

# Region
# variable "region_api" {
#   type    = string
#   default = "ap-northeast-1"
# }
variable "region_site" {
  type    = string
  default = "ap-northeast-1"
}
variable "region_acm" {
  type    = string
  default = "us-east-1"
}
variable "region_lambda_edge" {
  type    = string
  default = "us-east-1"
}

# ========================
# API Domain
# ========================
variable "route53_zone_id" {
  type = string
}
# variable "domain_api" {
#   type = string
# }

# ========================
# Static Site
# ======================== 
variable "domain_static_site" {
  type = string
}
variable "s3_static_site_force_destroy" {
  description = "S3 bucket force_destroy control. If true, it can be deleted even if objects exist"
  type        = bool
  default     = false
}

