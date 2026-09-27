# Current Astro MDX and Sentry Integration Configuration

## Status

implemented

## Lane

normal

## Product Contract

Astro's MDX processing and Sentry build configuration use supported options, configured remark/rehype plugins run through the Unified processor, and the build emits no deprecation or ignored-plugin warnings from these integrations.

## Relevant Product Docs

- `docs/product/website.md`

## Acceptance Criteria

- MDX remark/rehype processing is configured through Astro's Unified processor.
- Sentry source-map build settings use Sentry 11 top-level options.
- Sentry's public browser DSN uses the `PUBLIC_SENTRY_DSN` build-time variable.
- Static build succeeds without the reported integration warnings.
- Built MDX output demonstrates the configured code block wrapper/metadata behavior.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable |
| Integration | Astro static build succeeds without reported integration warnings |
| E2E | Not applicable |
| Platform | Not applicable |
| Release | Not applicable |

## Evidence

- Direct Astro static build passed under the repository-pinned Node 22 runtime; the reported MDX/Sentry deprecation and ignored-plugin warnings were absent.
- Harness completion reran the scoped app build and built all 97 pages; only the unrelated Astro transitions sourcemap warning and expected missing-token upload warnings remained.
- The built `notes/dari-zsh-ke-fish` page contains the configured code-block wrapper, copy control, and `config.fish` filename.
- Cypress browser check `bunx cypress run --spec cypress/e2e/markdown-processing.cy.ts --browser electron --config baseUrl=http://localhost:3000` passed 1/1.
- Focused Biome checks passed for `astro.config.ts`, `src/utils/env.ts`, and the new Cypress spec.
- Standard `bun run build` remains blocked by the existing Astro check incompatibility with TypeScript 7.0; direct Astro build passed.
- Sentry source-map upload warnings remain expected in this validation run because `SENTRY_AUTH_TOKEN` was intentionally blank; the existing Astro transitions sourcemap warning is unrelated.
- Update the Cloudflare Pages build variable from `SENTRY_DSN` to `PUBLIC_SENTRY_DSN` so Sentry's browser init can read the public DSN.
