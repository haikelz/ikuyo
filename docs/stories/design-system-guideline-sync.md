# Align design-system guidelines with current site

## Status

implemented

## Lane

normal

## Product Contract

The public `/design-system` reference and repository agent guidance describe
the ReUI Sera system implemented in the current Astro/Svelte site. `DESIGN.md`
owns design intent; source tokens and components demonstrate its implementation.

## Relevant Product Docs

- `DESIGN.md`
- `docs/product/website.md`
- `docs/decisions/0012-reui-visual-system-on-svelte.md`

## Acceptance Criteria

- `/design-system` documents the actual shared page shell and the existing
  Scrollspy, Timeline, Alert, Code Block, and Icon Tile patterns alongside Frame.
- Agent guidance no longer directs work in this repository toward the prior
  Geist Sans, neutral-only, base-nova/React application defaults.
- Existing routes, component behavior, static rendering, theme tokens,
  headings, navigation, and responsive layout stay intact.

## Design Notes

- Compose guidance in the existing Astro route; do not add hydration, a UI
  primitive, a dependency, or another source of color values.
- Keep the general ReUI defaults for other projects clearly separate from the
  repository-specific Sera contract.

## Validation

- Focused Biome check and Astro production build.
- Existing Frame and public-route responsive Cypress checks when runnable.
- Inspect `/design-system` at 375, 768, and 1280 CSS pixels, in light and dark
  mode, including the new section and working in-page navigation.
- Review the guideline diff against `DESIGN.md`, the token stylesheet, layout,
  and the actual components it describes.

## Harness Delta

- Intake #48; story `design-system-guideline-sync`. No Harness workflow or
  validation policy changes.

## Evidence

- `bunx biome check src/pages/design-system.astro` from `apps/web` and
  `git diff --check` from the root passed. ReUI C1–C4 checks on the changed
  route found no hits.
- `bun run --cwd apps/web build` passed: 93 static pages, no Astro errors or
  warnings, and two unrelated diagnostic hints. The build's Sentry integration
  automatically uploaded source maps; backlog #5 tracks a local-proof opt-out.
- `CYPRESS_BASE_URL=http://127.0.0.1:4311 bunx cypress run --spec
  cypress/e2e/frame.cy.ts --config
  screenshotsFolder=../../.amp/in/artifacts/cypress` from `apps/web` passed
  both Frame cases (390px and 1280px). The missing local Cypress binary was
  installed with `bunx cypress install` before the run.
- The built route at `http://127.0.0.1:4311/design-system` was inspected with
  `agent-browser` at 375px, 768px, and 1280px in light and dark modes. The new
  section shows all five rows at each width, without page-level horizontal
  overflow. Its desktop fragment link scrolls via pointer and keyboard; direct
  fragment navigation works on tablet and mobile, where the existing section
  navigation is hidden. The section's WCAG 2 A/AA audit found zero violations
  in light and dark modes. Captures are in `.amp/in/artifacts/`.
- `scripts/bin/harness-cli story complete design-system-guideline-sync`
  passed fresh proof with `bun run --cwd apps/web astro check && bun run
  --cwd apps/web biome check src/pages/design-system.astro`. The first proof
  attempt ran Biome from the root and hit conflicting nested configs; the
  corrected scoped command passed. A full 93-route responsive suite was not
  run; the changed route was inspected at every required width instead.
