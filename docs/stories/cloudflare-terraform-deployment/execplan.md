# Exec Plan

## Goal

Provide reviewable infrastructure code and a manual-first CI deployment path
for the existing Cloudflare Pages site.

## Scope

In scope:

- Terraform provider, variables, Pages project/domain, optional DNS, outputs,
  import examples, and operator guide.
- GitHub Actions build and Wrangler deployment workflow.
- Durable deployment decision and validation evidence.

Out of scope:

- `terraform apply`, state import, DNS changes, token creation, and live deploy.
- Remote-state backend selection.
- Automatic deployment before a manual deployment succeeds.

## Risk Classification

Risk flags:

- External systems.
- Existing deployment behavior.
- Public availability and DNS.
- Secret handling.

Hard gates:

- External provider behavior.
- Potential service interruption from incorrect Pages or DNS changes.

## Work Phases

1. Inspect current repository deployment assumptions and Cloudflare provider APIs.
2. Define Terraform/CI ownership and safe adoption boundaries.
3. Add infrastructure, workflow, documentation, and decision records.
4. Validate Terraform statically and run the existing website production build.
5. Leave live imports, plan review, apply, and deployment to the operator guide.

## Stop Conditions

Pause before any command that writes Cloudflare, GitHub, DNS, or remote state.
Stop the operator rollout if Terraform proposes replacement/deletion or the
manual Wrangler deployment does not preserve the current site behavior.
