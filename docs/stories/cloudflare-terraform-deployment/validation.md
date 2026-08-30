# Validation

## Proof Strategy

Validate Terraform syntax and provider schema without credentials or live
Cloudflare writes, parse the GitHub Actions workflow, and run the static Astro
production build. Live proof is deliberately pending operator import, reviewed
plan, manual apply, and manual workflow deployment.

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit | Terraform formatting and validation; workflow YAML parsing |
| Integration | Frozen dependency install and Astro production build |
| E2E | Existing site route suite remains unchanged |
| Platform | Imported plan has no replacement; manual Wrangler deployment returns working production/preview URLs |
| Performance | No duplicate Git and Wrangler builds after rollout |
| Logs/Audit | Terraform plan and GitHub deployment URL are retained by their platforms |

## Fixtures

- Placeholder-safe `terraform.tfvars.example`.
- Existing Pages project, custom domain, and DNS IDs supplied by the operator.
- GitHub repository secrets and variables listed in the operator guide.

## Commands

```text
terraform -chdir=infra/cloudflare fmt -check
terraform -chdir=infra/cloudflare init -backend=false
terraform -chdir=infra/cloudflare validate
bun run --cwd apps/web build
```

## Acceptance Evidence

- `terraform -chdir=infra/cloudflare fmt -check -recursive`: passed.
- `terraform -chdir=infra/cloudflare init -backend=false`: installed the pinned
  Cloudflare provider 5.24.0 and generated the committed dependency lockfile.
- `terraform -chdir=infra/cloudflare validate`: passed; Pages project, custom
  domain, optional DNS record, lifecycle guards, and provider schema are valid.
- Ruby standard-library YAML parsing loaded the GitHub Actions workflow and
  found its job structure.
- `bun run --cwd apps/web build`: passed Astro check with zero diagnostics and
  generated 91 static pages.
- No Terraform import, plan against the account, apply, DNS write, GitHub secret
  write, or Pages deployment was performed. Platform proof remains false until
  the operator completes the manual rollout.
