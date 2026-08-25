# GitHub Contribution Graph — Validation

## Proof Strategy

Use deterministic Cypress intercepts for valid and malformed provider payloads, then inspect the real layout at mobile, tablet, and desktop widths. Keep the production build independent of provider availability.

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit | Astro/Svelte diagnostics and focused Biome checks |
| Integration | Valid payload renders a calendar, day tooltip, and year switching; malformed payload renders unavailable state |
| E2E | Homepage no longer contains the old statement, platform heading, or visible username |
| Platform | Shared year Select aligns with the homepage eyebrow; graph scrolls horizontally at 375px; page does not overflow at 375px, 768px, or 1280px |
| Performance | No build-time provider request or new dependency |
| Logs/Audit | No sensitive data or provider payload logging |

## Fixtures

- A deterministic two-year contribution response with levels 0–4.
- A malformed response missing a valid contributions array.

## Commands

```text
bunx biome check apps/web/src/components/svelte/GitHubContributionGraph.svelte apps/web/src/pages/index.astro apps/web/cypress/e2e/github-contributions.cy.ts
bun run --cwd apps/web astro -- check
bunx cypress run --project apps/web --browser electron --spec apps/web/cypress/e2e/github-contributions.cy.ts
bun run --cwd apps/web build
```

## Acceptance Evidence

- Focused Biome validation passed for the graph component, homepage integration,
  and Cypress specification.
- `astro check` passed across 54 files with 0 errors, warnings, or hints.
- Focused Cypress validation passed 5/5 scenarios: the replaced hero content,
  custom count-and-date tooltip, year switching through the shared Select,
  eyebrow alignment, mobile internal scrolling without document overflow, and
  malformed-provider fallback.
- Responsive Cypress validation passed 6/6 mobile, tablet, and desktop checks.
- Desktop and mobile screenshots were inspected. The graph remains monochrome,
  square, and border-led; its weeks fill the available desktop width through
  December; the Select aligns with `Product/Devops`; the mobile graph is
  contained by its horizontal scroll region.
- The static production build completed successfully with 91 pages. Contribution
  data was not required during the build.
