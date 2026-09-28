# Modernize View Transitions Without Sliding Content Reveals

## Status

completed

## Lane

normal

## Product Contract

Public pages use a restrained opacity cross-fade for Astro route transitions.
Page content appears without sliding or staggered enter animations.

## Relevant Product Docs

- `DESIGN.md`
- `docs/product/website.md`

## Acceptance Criteria

- Astro route transitions cross-fade without translating old or new page content.
- No page or component uses the former sliding/staggered content reveal.
- Reduced-motion preferences disable view-transition animation.
- Existing shimmer and pulse effects remain unchanged.

## Design Notes

- Commands: `bun run --cwd apps/web build`
- UI surfaces: all Astro routes using `ClientRouter`.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable; CSS-only motion rules. |
| Integration | Astro production build. |
| E2E | Browser route navigation and reduced-motion behavior. |
| Platform | Responsive inspection at mobile, tablet, and desktop widths. |
| Release | Not applicable. |

## Harness Delta

No Harness changes beyond the intake, story, and trace records for this work.

## Evidence

- `bun run --cwd apps/web build` passed: Astro check reported 0 errors and 0 warnings (one existing Zod URL deprecation hint); all 94 static pages built.
- `bun run --cwd apps/web cypress run --browser chrome --config baseUrl=http://127.0.0.1:3001 --spec cypress/e2e/view-transitions.cy.ts` passed route navigation and assertions for the built cross-fade and reduced-motion rules.
- `bun run --cwd apps/web cypress run --browser chrome --config baseUrl=http://127.0.0.1:3001 --spec cypress/e2e/public-routes-responsive.cy.ts` passed all 104 public route entries at mobile, tablet, and desktop widths (312 fresh screenshots; no horizontal overflow).
- `bun run --cwd apps/web biome check src/index.css src/styles/animations.css cypress/e2e/view-transitions.cy.ts` passed.
- The full `bun run --cwd apps/web lint:biome` remains red on 15 existing formatting/lint findings across the project; no auto-fixes were applied.
