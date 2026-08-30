# Overview

## Current Behavior

Cloudflare Pages builds the static Astro site through dashboard-managed Git
integration. The repository pins Node.js but does not version the Pages project,
custom-domain infrastructure, DNS ownership, or a direct-upload CI workflow.

## Target Behavior

Terraform safely adopts and protects the existing Pages project and custom
domain without disconnecting GitHub or overwriting dashboard secrets. A
manual-first GitHub Actions workflow builds the site and uploads static assets
with Wrangler. Automatic deployment is enabled only after manual proof.

## Affected Users

- Site operator maintaining Cloudflare configuration and releases.
- Visitors relying on `ekel.dev` remaining available during the transition.

## Affected Product Docs

- `docs/product/website.md`
- `docs/decisions/0010-cloudflare-node-runtime.md`

## Non-Goals

- Running Terraform against the live Cloudflare account.
- Triggering a Pages deployment from this implementation task.
- Moving Pages environment secrets into committed Terraform files.
- Replacing Cloudflare Pages with Workers.
