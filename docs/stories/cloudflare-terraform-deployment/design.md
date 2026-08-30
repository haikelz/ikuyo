# Design

## Domain Model

The deployment has three durable resources: one Pages project, one Pages custom
domain, and optionally one proxied DNS record. A deployment is an immutable
Wrangler-uploaded static asset bundle and is not a Terraform resource.

## Application Flow

1. An operator imports existing Cloudflare resources into Terraform state.
2. Terraform plans project/domain/DNS configuration without replacing them.
3. GitHub Actions checks out a selected branch and builds `apps/web/dist`.
4. Wrangler uploads the bundle to the existing project with the Git branch.
5. Cloudflare maps `master` to production and other branches to previews.

## Interface Contract

- Terraform provider: `cloudflare/cloudflare ~> 5.24.0`.
- CI deploy command: `wrangler pages deploy apps/web/dist` with explicit Pages
  project and branch.
- Required deployment credentials: scoped Pages API token and account ID.
- Production branch: `master`.

## Data Model

Terraform state contains Cloudflare resource identifiers and configuration. It
must not be committed. Secret deployment values stay in GitHub Actions secrets;
the first configuration intentionally ignores existing Pages deployment config
and source details during adoption.

## UI / Platform Impact

No website UI changes. A bad Pages or DNS plan could make the public site
unavailable, so resources use `prevent_destroy`, DNS management defaults off,
and CI starts with a manual-only trigger.

## Observability

GitHub Actions records build/deploy logs and the Wrangler deployment and branch
alias URLs. Terraform plan is the required review artifact before apply.

## Alternatives Considered

1. Terraform `local-exec` for asset upload was rejected because deployments are
   non-idempotent release events, not infrastructure state.
2. Immediate automatic deployment was rejected because it could race the
   existing Cloudflare Git integration.
3. Recreating the Pages project was rejected because it risks domain downtime
   and loses existing deployment history and settings.
4. Codifying all dashboard secrets immediately was rejected because secret
   values enter Terraform state and existing secrets can block project import.
