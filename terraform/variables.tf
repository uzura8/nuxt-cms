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

# ========================
# Nuxt SSR (Serverless HTTP API) — CloudFront 第 2 オリジン
# ========================
variable "nuxt_ssr_http_api_host" {
  description = <<-EOT
    API Gateway HTTP API のホスト名のみ（例: 7j78rtyiq6.execute-api.ap-northeast-1.amazonaws.com）。
    空のときは従来どおり S3 のみ。非空のときは path /posts* をこのオリジンへ振り分ける。
    併用時はカスタムエラー 404/403→200.html を無効化する（API オリジンに 200.html が無いため）。
  EOT
  type        = string
  default     = ""
}

