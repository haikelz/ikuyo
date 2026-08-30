output "pages_project_name" {
  description = "Cloudflare Pages project managed by this configuration."
  value       = cloudflare_pages_project.site.name
}

output "pages_hostname" {
  description = "Default Pages hostname used by the custom-domain CNAME."
  value       = local.pages_hostname
}

output "custom_domain" {
  description = "Custom domain attached to the Pages project."
  value       = cloudflare_pages_domain.site.name
}
