# Keep Astro Type Checking on a Supported TypeScript Version

## Status

implemented

## Lane

normal

## Product Contract

The web workspace's Astro check uses a TypeScript release supported by the installed Astro checker and Svelte integration, so CI can type-check and build the site.

## Relevant Product Docs

- `docs/product/website.md`

## Acceptance Criteria

- The root TypeScript dependency is pinned to the supported TypeScript 6 release line.
- `bun.lock` resolves that same TypeScript version.
- The web Astro check and build complete successfully.

## Design Notes

- Keep Astro and its checker versions unchanged; only align the root TypeScript version with their supported peer range.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable |
| Integration | `bun run --cwd apps/web build` passes Astro check and static build |
| E2E | Not applicable |
| Platform | Not applicable |
| Release | Not applicable |

## Harness Delta

- None.

## Evidence

- `bun run --cwd apps/web build` passed twice, including Harness fresh proof: Astro check reported 0 errors and Astro built all 94 pages.
- `bunx biome check --formatter-enabled=false package.json` passed.
- `bun run --cwd apps/web biome check --formatter-enabled=false astro.config.ts` passed.
- `git diff --check` passed.
- TypeScript 6 exposed a `rehype-preset-minify` declaration mismatch in Astro's narrower `RehypePlugin` type; the existing Unified preset remains in use with an explicit compatibility cast.
- Existing Zod URL and unused map-index hints plus Sentry/Astro transition sourcemap warnings remain unrelated.
