variable "cloudflare_account_id" {
  description = "Cloudflare account ID that owns the Pages project."
  type        = string
  sensitive   = true

  validation {
    condition     = can(regex("^[0-9a-f]{32}$", var.cloudflare_account_id))
    error_message = "cloudflare_account_id must be a 32-character hexadecimal ID."
  }
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for the custom domain."
  type        = string
  sensitive   = true

  validation {
    condition     = can(regex("^[0-9a-f]{32}$", var.cloudflare_zone_id))
    error_message = "cloudflare_zone_id must be a 32-character hexadecimal ID."
  }
}

variable "pages_project_name" {
  description = "Existing Cloudflare Pages project name."
  type        = string

  validation {
    condition     = can(regex("^[a-z0-9][a-z0-9-]*$", var.pages_project_name))
    error_message = "pages_project_name must use lowercase letters, numbers, and hyphens."
  }
}

variable "production_branch" {
  description = "Branch that Cloudflare treats as production."
  type        = string
  default     = "master"
}

variable "domain_name" {
  description = "Custom domain attached to the Pages project."
  type        = string
  default     = "ekel.dev"
}

variable "manage_dns_record" {
  description = "Whether Terraform should manage the proxied Pages CNAME. Keep false until the existing record is imported."
  type        = bool
  default     = false
}
