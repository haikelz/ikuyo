locals {
  pages_hostname = "${var.pages_project_name}.pages.dev"
}

resource "cloudflare_pages_project" "site" {
  account_id        = var.cloudflare_account_id
  name              = var.pages_project_name
  production_branch = var.production_branch

  lifecycle {
    prevent_destroy = true

    # Preserve the existing Git connection, build settings, and dashboard
    # environment values during the first Terraform adoption. Wrangler owns
    # asset deployments; these settings can be codified after state import.
    ignore_changes = [build_config, deployment_configs, source]
  }
}

resource "cloudflare_pages_domain" "site" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.site.name
  name         = var.domain_name

  lifecycle {
    prevent_destroy = true
  }
}

resource "cloudflare_dns_record" "pages" {
  count = var.manage_dns_record ? 1 : 0

  zone_id = var.cloudflare_zone_id
  name    = var.domain_name
  type    = "CNAME"
  content = local.pages_hostname
  proxied = true
  ttl     = 1
  comment = "Cloudflare Pages custom domain managed by Terraform"

  lifecycle {
    prevent_destroy = true
  }
}
