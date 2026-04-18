## S3 for cloudfront logs
#resource "aws_s3_bucket" "accesslog_static_site" {
#  provider      = aws.site
#  bucket        = "${local.fqdn.static_site}-accesslog"
#  force_destroy = true # Set true, destroy bucket with objects
#  acl           = "log-delivery-write"
#
#  tags = {
#    Name      = join("-", [local.name_prefix, "s3", "accesslog_static_site"])
#    ManagedBy = "terraform"
#  }
#}

# ACM and Route53
## ACM Certification
resource "aws_acm_certificate" "static_site" {
  provider          = aws.acm
  domain_name       = local.fqdn.static_site
  validation_method = "DNS"

  tags = {
    Name      = join("-", [local.name_prefix, "acm_static_site"])
    ManagedBy = "terraform"
  }
}

# CNAME Record
resource "aws_route53_record" "static_site_acm_c" {
  for_each = {
    for d in aws_acm_certificate.static_site.domain_validation_options : d.domain_name => {
      name   = d.resource_record_name
      record = d.resource_record_value
      type   = d.resource_record_type
    }
  }
  zone_id         = var.route53_zone_id
  name            = each.value.name
  type            = each.value.type
  ttl             = 172800
  records         = [each.value.record]
  allow_overwrite = true
}
## Related ACM Certification and CNAME record
resource "aws_acm_certificate_validation" "static_site" {
  provider                = aws.acm
  certificate_arn         = aws_acm_certificate.static_site.arn
  validation_record_fqdns = [for record in aws_route53_record.static_site_acm_c : record.fqdn]
}
## A record
resource "aws_route53_record" "static_site_cdn_a" {
  zone_id = var.route53_zone_id
  name    = local.fqdn.static_site
  type    = "A"
  alias {
    evaluate_target_health = true
    name                   = aws_cloudfront_distribution.static_site.domain_name
    zone_id                = aws_cloudfront_distribution.static_site.hosted_zone_id
  }
}

# # Lambda@Edge
# ## Create IAM Role and Policy
# resource "aws_iam_role" "lambda_edge_role" {
#   name = "${local.name_prefix}-lambda-edge-role"
#   assume_role_policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [
#       {
#         Effect = "Allow",
#         Principal = {
#           Service = [
#             "lambda.amazonaws.com",
#             "edgelambda.amazonaws.com"
#           ]
#         },
#         Action = "sts:AssumeRole"
#       }
#     ]
#   })
# }
# resource "aws_iam_role_policy" "lambda_edge_policy" {
#   name = "${local.name_prefix}-lambda-edge-policy"
#   role = aws_iam_role.lambda_edge_role.id
#   policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [
#       {
#         Effect = "Allow",
#         Action = [
#           "logs:CreateLogGroup",
#           "logs:CreateLogStream",
#           "logs:PutLogEvents"
#         ],
#         Resource = "*"
#       }
#     ]
#   })
# }

# ## Lambda@Edge Function
# resource "aws_lambda_function" "lambda_edge_viewer_request" {
#   provider      = aws.lambda_edge
#   function_name = join("-", [local.name_prefix, "lambda_edge", "viewer_request"])
#   role          = aws_iam_role.lambda_edge_role.arn
#   handler       = "index.handler"
#   runtime       = "nodejs22.x"

#   # Put zip file to dist directory
#   filename         = "${path.root}/functions/dist/lambda_edge_viewer_request.zip"
#   source_code_hash = filebase64sha256("${path.root}/functions/dist/lambda_edge_viewer_request.zip")
#   publish          = true
# }

# CloudFront
## CloudFront OAI
resource "aws_cloudfront_origin_access_identity" "static_site" {
  comment = "Origin Access Identity for s3 ${local.bucket.static_site} bucket"
}
## Cache Policy
data "aws_cloudfront_cache_policy" "managed_caching_optimized" {
  name = "Managed-CachingOptimized"
}
data "aws_cloudfront_cache_policy" "managed_caching_disabled" {
  name = "Managed-CachingDisabled"
}
### Refer: Elemental-MediaPackage for CORS
data "aws_cloudfront_cache_policy" "elemental_media_package" {
  name = "Managed-Elemental-MediaPackage"
}
## Origin Request Policy
### Refer: CORS-S3Origin for CORS
data "aws_cloudfront_origin_request_policy" "cors_s3origin" {
  name = "Managed-CORS-S3Origin"
}

# execute-api オリジンでは Host がビューアのドメインのままだと失敗するため、Host をオリジン向けに差し替える
data "aws_cloudfront_origin_request_policy" "all_viewer_except_host_header" {
  name = "Managed-AllViewerExceptHostHeader"
}

# CloudFront は us-east-1 API 前提のため lambda_edge（既定 us-east-1）を使う
resource "aws_cloudfront_function" "s3_prerender_directory_index" {
  provider = aws.lambda_edge
  name     = join("-", [local.name_prefix, "cf", "s3-prerender-dir-index"])
  runtime  = "cloudfront-js-1.0"
  comment  = "Map /about -> /about/index.html for S3+OAI (avoids 403 AccessDenied on missing key)"
  publish  = true
  code     = file("${path.module}/functions/cloudfront/s3_prerender_directory_index.js")
}

## Distribution for Static Site
resource "aws_cloudfront_distribution" "static_site" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  origin {
    domain_name = "${local.bucket.static_site}.s3.${var.region_site}.amazonaws.com"
    origin_id   = "S3-${local.fqdn.static_site}"
    # S3 を 非公開のまま CloudFront だけに読ませるための Origin Access Identity を指定
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.static_site.cloudfront_access_identity_path
    }
  }

  # 条件付きの「カスタム」オリジン
  dynamic "origin" {
    # nuxt_ssr_http_api_host の指定がある場合のみオリジン追加
    for_each = trimspace(var.nuxt_ssr_http_api_host) != "" ? [trimspace(var.nuxt_ssr_http_api_host)] : []
    content {
      domain_name = origin.value # nuxt server と連携する API Gateway HTTP API のドメイン名
      origin_id   = "NuxtSsr-HttpApi"
      custom_origin_config {
        http_port                = 80
        https_port               = 443
        origin_protocol_policy   = "https-only"
        origin_ssl_protocols     = ["TLSv1.2"]
        origin_read_timeout      = 60
        origin_keepalive_timeout = 5
      }
    }
  }

  # Alternate Domain Names (CNAMEs)
  # ココを指定しないとデフォルトの xxxx.cloudfront.net のドメインだけで配信される
  aliases = [local.fqdn.static_site]

  # Config for SSL Certification
  viewer_certificate {
    cloudfront_default_certificate = false
    # acm_certificate_arn            = aws_acm_certificate.static_site.arn
    acm_certificate_arn      = aws_acm_certificate_validation.static_site.certificate_arn
    minimum_protocol_version = "TLSv1.2_2021"
    ssl_support_method       = "sni-only"
  }

  # destroy 後に distribution を残したい場合は true にする
  retain_on_delete = false

  #logging_config {
  #  include_cookies = true
  #  bucket          = "${aws_s3_bucket.accesslog_static_site.id}.s3.amazonaws.com"
  #  prefix          = "log/static/prd/cf/"
  #}

  # 存在しないオブジェクト（例: /posts/foo）向けフォールバック（S3 のみのとき）。
  # Nuxt のトップ用 index.html にはルート向け SSR ペイロードが入るため、それを返すと
  # クライアントが URL を `/` に合わせる。Nuxt の prerender で生成する `/200.html` を返す。
  #
  # SSR オリジン併用時は distribution 単位の custom_error が API 404 にも効き、
  # response_page_path を API オリジンが解釈できず破綻するため無効化する。
  dynamic "custom_error_response" {
    # オリジン（S3）から 404 / 403 が返ったときの挙動を指定
    for_each = trimspace(var.nuxt_ssr_http_api_host) == "" ? toset([404, 403]) : toset([])
    #　 存在しないパス（例: /posts/foo）をリクエストされた場合、ルート用の index.html をそのまま返すと、
    # Nuxt のハイドレーションと URL が噛み合わず / に寄ってしまう
    # 代わりに /200.html を返してクライアント側ルーティング用の安全なフォールバックにしている -> nuxt.config.ts にて指定
    content {
      error_code         = custom_error_response.value # 404 / 403
      response_code      = 200
      response_page_path = "/200.html"
    }
  }

  # パスが "/posts*" 以外の場合のデキャッシュビヘイビア
  default_cache_behavior {
    target_origin_id = "S3-${local.fqdn.static_site}" # origin は S3
    #viewer_protocol_policy = "allow-all"
    viewer_protocol_policy = "redirect-to-https" # http リクエストは HTTPS にリダイレクト
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"] # GET と HEAD のみキャッシュ

    compress = true # 圧縮を有効化

    # TTL やクエリ文字列・Cookie・ヘッダーを AWS 管理の「CachingOptimized」ポリシーに任せる
    cache_policy_id = data.aws_cloudfront_cache_policy.managed_caching_optimized.id

    # # cache_policy_id を使用する場合は以下のパラメータは不要
    # min_ttl         = 0
    # default_ttl     = 3600
    # max_ttl         = 86400

    # Lambda@Edge（viewer-request）は末尾スラッシュ強制の 302 を返す（functions/src/viewer_request）。
    # Nuxt 静的ホスティングと併用する場合はトラフィックに影響するため、一旦無効化する場合は
    # 以下のブロックをコメントアウトする（配信更新後にキャッシュ無効化が必要な場合あり）。
    # lambda_function_association {
    #   event_type   = "viewer-request"
    #   lambda_arn   = aws_lambda_function.lambda_edge_viewer_request.qualified_arn
    #   include_body = false
    # }

    # S3 オリジンは Web サイトエンドポイントの「ディレクトリ index」相当が無い。
    # `/about` はオブジェクト `about` として解釈され 403 になり得るため、prerender の `about/index.html` に寄せる。
    # `/posts*` は ordered_cache_behavior 側のためこの関数は掛からない。
    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.s3_prerender_directory_index.arn
    }
  }

  # パスが "/posts*" の場合のデキャッシュビヘイビア
  dynamic "ordered_cache_behavior" {
    # nuxt_ssr_http_api_host の指定がある場合のみオリジン追加
    for_each = trimspace(var.nuxt_ssr_http_api_host) != "" ? [1] : []
    content {
      path_pattern     = "/posts*"
      target_origin_id = "NuxtSsr-HttpApi" # Nuxt SSR server
      # ビューア → CloudFront は HTTPS に統一。オリジンは execute-api へ HTTPS。
      viewer_protocol_policy = "redirect-to-https"
      allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
      cached_methods         = ["GET", "HEAD"] # GET と HEAD のみキャッシュ
      compress               = true
      cache_policy_id        = data.aws_cloudfront_cache_policy.managed_caching_disabled.id # 実質キャッシュOFFの指定
      # ビューアから来た クエリ文字列・Cookie・ヘッダーをオリジンに渡すが、Hostだけはビューアの値をそのまま使わず、内部 Host 名に差し替える
      origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer_except_host_header.id
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

## Bucket Policy
### Allow from only CloudFront
data "aws_iam_policy_document" "s3_policy_static_site" {
  statement {
    #sid     = "PublicRead"
    sid     = "AllowCloudFrontAccess"
    effect  = "Allow"
    actions = ["s3:GetObject"]
    resources = [
      #aws_s3_bucket.static_site.arn,
      "${aws_s3_bucket.static_site.arn}/*"
    ]

    # Accept to access from CloudFront only
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.static_site.iam_arn]
    }

    ## Accept to access from All
    #principals {
    #  identifiers = ["*"]
    #  type        = "*"
    #}
  }
}
### Related S3 Bucket Policy
resource "aws_s3_bucket_policy" "static_site" {
  provider = aws.site
  bucket   = aws_s3_bucket.static_site.id
  policy   = data.aws_iam_policy_document.s3_policy_static_site.json
}

## S3 for Static Website Hosting
resource "aws_s3_bucket" "static_site" {
  provider      = aws.site
  bucket        = local.bucket.static_site
  force_destroy = var.s3_static_site_force_destroy

  #acl = "private" # Accept to access from CloudFront only
  ##acl = "public-read" # Accept to access to S3 Bucket from All

  #logging {
  #  target_bucket = aws_s3_bucket.accesslog_static_site.id
  #  target_prefix = "log/static/prd/s3/"
  #}

  lifecycle {
    ignore_changes = [
      cors_rule,
      server_side_encryption_configuration,
    ]
  }

  #website {
  #  index_document = "index.html"
  #  error_document = "error.html"
  #}

  tags = {
    Name      = join("-", [local.name_prefix, "s3", "static_site"])
    ManagedBy = "terraform"
  }
}
#resource "aws_s3_bucket_website_configuration" "static_site_website" {
#  provider = aws.site
#  bucket = aws_s3_bucket.static_site.id
#
#  index_document {
#    suffix = "index.html"
#  }
#
#  error_document {
#    key = "error.html"
#  }
#}

# S3 Public Access Block
# Deny to access from All
resource "aws_s3_bucket_public_access_block" "static_site" {
  provider                = aws.site
  bucket                  = aws_s3_bucket.static_site.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
## Accept to access from All
#resource "aws_s3_bucket_public_access_block" "static_site" {
#  provider                = aws.site
#  bucket                  = aws_s3_bucket.static_site.id
#  block_public_acls       = false
#  block_public_policy     = false
#  ignore_public_acls      = false
#  restrict_public_buckets = false
#}

