# Cloudflare Node Runtime

## Current Behavior

Cloudflare Pages selects Node.js 20.17.0 for the production build. Astro 6
requires Node.js 22.12.0 or newer, so `web:check` exits before the static site
can build.

## Target Behavior

The repository declares a supported Node.js version that Cloudflare Pages can
detect before running the existing Bun and Moon build command.

## Affected Users

- Maintainers deploying the public website.
- Visitors waiting for production updates.

## Affected Product Docs

- `docs/product/website.md`

## Non-Goals

- Changing the Bun package-management workflow.
- Changing Cloudflare project settings or deployment commands.
- Addressing Moon's non-fatal shallow-checkout warning.
