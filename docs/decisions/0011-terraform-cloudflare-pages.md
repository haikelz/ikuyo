# 0011 Separate Cloudflare Infrastructure from Website Deployment

Date: 2026-08-29

## Status

Accepted

## Context

The existing static Astro site is deployed through Cloudflare Pages Git
integration. The project, custom domain, and DNS configuration are hidden in the
dashboard, while website releases are build artifacts that change on every
commit. Adopting Terraform must not recreate the project, disconnect GitHub,
expose secrets in source, or interrupt `ekel.dev`.

## Decision

Terraform manages durable Cloudflare Pages infrastructure: the existing project,
custom domain, and optionally the proxied DNS record. Existing resources are
imported before apply and protected with `prevent_destroy`. Source, build, and
deployment configuration are ignored during initial adoption.

GitHub Actions owns release execution. It builds the static Astro output and
Wrangler uploads `apps/web/dist` to the existing Pages project. The workflow is
manual-only until a deployment is verified; automatic Git deployments are then
disabled before enabling push-triggered Wrangler deployments.

## Alternatives Considered

1. Upload assets with Terraform `local-exec`. Rejected because releases are
   non-idempotent events and do not belong in Terraform state.
2. Keep all configuration in the Cloudflare dashboard. Rejected because the
   infrastructure remains unreviewable and hard to reproduce.
3. Create a replacement Direct Upload project. Rejected because switching the
   domain risks downtime and discards existing settings/history.
4. Manage Pages secrets in Terraform immediately. Rejected because values are
   stored in state and existing secret variables can prevent import.

## Consequences

Positive:

- Cloudflare infrastructure becomes reviewable and protected from deletion.
- Builds and deployments have visible GitHub logs and explicit URLs.
- The existing deployment remains available during staged migration.

Tradeoffs:

- Operators must manage Terraform state securely.
- Initial import may require temporary handling of existing secret environment
  values.
- Dashboard source/build settings remain partially unmanaged until a later,
  separately reviewed codification.

## Follow-Up

- Import the existing resources and require a no-replacement plan.
- Run and verify one manual Wrangler deployment.
- Disable duplicate Git deployments before enabling workflow push triggers.
- Select a remote Terraform backend before multiple operators use the state.
