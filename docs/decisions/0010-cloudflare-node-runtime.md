# 0010 Version the Cloudflare Node Runtime

Date: 2026-08-25

## Status

Accepted

## Context

Cloudflare Pages selected Node.js 20.17.0 while Astro 6 requires Node.js
22.12.0 or newer. The build failed in `web:check` before static generation.
Cloudflare supports `.node-version` and `NODE_VERSION`, but dashboard-only
configuration is not visible in repository review.

## Decision

Declare Node.js 22.16.0 in the repository-root `.node-version` file. Keep Bun
as the package manager and Moon as the task runner.

## Alternatives Considered

1. Configure `NODE_VERSION` only in Cloudflare. Rejected because it creates
   hidden deployment state.
2. Add `package.json#engines`. Rejected because Cloudflare does not use it to
   select the build runtime.
3. Pin the minimum Node.js 22.12.0. Rejected in favor of Cloudflare's documented
   22.16.0 release, which also satisfies Astro.

## Consequences

Positive:

- Cloudflare can select a supported runtime before invoking Astro.
- Local Node-aware tools can align with the deployment runtime.

Tradeoffs:

- The pinned release requires an explicit repository update when upgraded.
- A dashboard-level `NODE_VERSION` override, if present, may take precedence
  and must be removed or updated manually.

## Follow-Up

- Confirm the next Cloudflare Pages log reports Node.js 22.16.0.
