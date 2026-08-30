# Cloudflare Pages with Terraform and Wrangler

Terraform adopts and protects the existing Cloudflare Pages project, custom
domain, and optional DNS record. GitHub Actions builds the static Astro site and
Wrangler uploads `apps/web/dist`. Terraform does not upload website assets.

The rollout is intentionally manual first. Do not run `terraform apply`, remove
the current Git integration, or enable automatic Wrangler deployments until a
reviewed plan and one manual deployment have succeeded.

## 1. Collect the Cloudflare values

From **Cloudflare Dashboard → Workers & Pages**, record the existing Pages
project name and production branch. From the account and `ekel.dev` zone pages,
record:

- Account ID
- Zone ID
- Existing Pages project name
- Existing DNS record ID for `ekel.dev`, if DNS will be managed here

Create a custom API token with only:

- **Account → Cloudflare Pages → Edit**
- **Zone → DNS → Edit** for `ekel.dev` when managing DNS

Keep the token out of Terraform files and Git. Export it only in the shell:

```bash
export CLOUDFLARE_API_TOKEN='<cloudflare-api-token>'
```

## 2. Prepare local Terraform variables

```bash
cp infra/cloudflare/terraform.tfvars.example infra/cloudflare/terraform.tfvars
```

Replace the placeholder IDs and project name. `terraform.tfvars` is ignored by
Git. Keep `manage_dns_record = false` during the first import.

## 3. Initialize and inspect the configuration

```bash
terraform -chdir=infra/cloudflare init
terraform -chdir=infra/cloudflare fmt -check
terraform -chdir=infra/cloudflare validate
```

Commit `.terraform.lock.hcl` so every environment uses the same provider build.

## 4. Import the existing Pages resources

Do not apply before import: Terraform would otherwise try to create resources
that already exist.

```bash
terraform -chdir=infra/cloudflare import \
  cloudflare_pages_project.site \
  '<ACCOUNT_ID>/<PAGES_PROJECT_NAME>'

terraform -chdir=infra/cloudflare import \
  cloudflare_pages_domain.site \
  '<ACCOUNT_ID>/<PAGES_PROJECT_NAME>/ekel.dev'
```

Cloudflare currently cannot import a Pages project containing secret
environment variables. If import reports that condition, stop. Inventory the
values first, temporarily remove only the secret values in the dashboard,
import the project, and restore them through the chosen secret store. Never put
secret values in committed `.tf` or `.tfvars` files; Terraform-managed secrets
are stored in Terraform state.

The equivalent configuration-driven imports are documented in
`imports.tf.example`.

## 5. Review the first plan

```bash
terraform -chdir=infra/cloudflare plan -out=tfplan
terraform -chdir=infra/cloudflare show tfplan
```

The first safe plan must contain no project/domain deletion or replacement.
`source`, `build_config`, and `deployment_configs` are intentionally ignored
during adoption, so Terraform will not disconnect GitHub or overwrite existing
dashboard environment values.

Only after reviewing the plan:

```bash
terraform -chdir=infra/cloudflare apply tfplan
```

This command changes shared Cloudflare state. Run it manually; do not add it to
the website deployment workflow.

## 6. Optionally adopt the DNS record

Confirm that the existing `ekel.dev` record is a proxied CNAME pointing to
`<PAGES_PROJECT_NAME>.pages.dev`. Then set `manage_dns_record = true`, import the
record, and review another plan:

```bash
terraform -chdir=infra/cloudflare import \
  'cloudflare_dns_record.pages[0]' \
  '<ZONE_ID>/<DNS_RECORD_ID>'

terraform -chdir=infra/cloudflare plan
```

Stop if Terraform proposes replacing the record or changing it to an unexpected
target.

## 7. Configure GitHub Actions

In **GitHub → Settings → Secrets and variables → Actions**, add:

Repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `SENTRY_DSN`
- `SENTRY_PROJECT`
- `SENTRY_AUTH_TOKEN`
- `IMAGEKIT_PRIVATE_KEY`

Repository variables:

- `CLOUDFLARE_PAGES_PROJECT`
- `PUBLIC_PRODUCTION_URL`
- `PUBLIC_DEVELOPMENT_URL`
- `BACKEND_API_URL`
- `IMAGEKIT_API_BASE_URL`
- `PUBLIC_UMAMI_SRC`
- `PUBLIC_UMAMI_WEBSITE_ID`
- `PUBLIC_GOATCOUNTER_SRC`

The Cloudflare token used by GitHub needs **Cloudflare Pages: Edit** permission.
The Terraform token may be separate and can additionally include scoped DNS
permission.

## 8. Run the first manual deployment

Open **GitHub → Actions → Deploy Cloudflare Pages → Run workflow** and select
`master`. The workflow will:

1. Install the repository's pinned Node and Bun versions.
2. Install dependencies with the frozen Bun lockfile.
3. Run the Astro check and static build.
4. Upload `apps/web/dist` with Wrangler.

Verify the returned `pages.dev` URL, `https://ekel.dev`, the homepage, one note,
one work, and the IHSG page before changing the old deployment path.

## 9. Enable automatic deployment

After the manual workflow is proven:

1. Uncomment the `push` trigger in
   `.github/workflows/deploy-cloudflare-pages.yml`.
2. In Cloudflare Pages settings, disable automatic production and preview Git
   deployments to avoid duplicate builds. Keep the repository connection until
   the new path has been stable and rollback is understood.
3. Push `master` for production. Push `dev` for a branch preview at
   `dev.<PAGES_PROJECT_NAME>.pages.dev`.

If Wrangler deployment fails, leave the existing Git deployment enabled and
fix the workflow first. Do not change DNS as part of deployment troubleshooting.

## State storage

Local state files are ignored as a safe starting point for one operator. Before
multiple people run Terraform, migrate state to a remote backend with locking
and restricted access. Never commit `terraform.tfstate`.
