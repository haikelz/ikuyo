# Editorial Portfolio and SEO

## Status

changed

## Lane

normal

## Product Contract

Make the portfolio feel more modern and editorial without reducing its content
density, changing its static architecture, or replacing the monochrome,
border-led visual system. Every public page must also expose consistent,
crawlable SEO metadata from the shared layout.

## Relevant Product Docs

- `docs/product/website.md`
- `DESIGN.md`

## Acceptance Criteria

- The homepage gives experience, work, and notes distinct editorial treatments
  while preserving collection-backed content and links.
- The homepage activity calendar uses a shape-matched skeleton while its
  provider request is pending, without relying on motion to communicate state.
- Work cards remain text-first without thumbnail previews, and experience
  summaries provide a clear path to their detail pages while retaining every
  authored highlight.
- Featured Works and Latest Notes share the same bordered editorial-list
  treatment for a consistent homepage rhythm.
- The full Works and Notes indexes reuse that same list system instead of a
  separate card grid.
- Guestbook entries reuse the list system with date, message, and author
  columns while preserving the existing API-backed source.
- Every public route uses the homepage's editorial hierarchy, mono eyebrow
  labels, square transparent surfaces, and border-led grouping while retaining
  the structure needed by galleries, charts, long-form articles, and error
  pages.
- Experience detail pages use structured case-study presentation and a
  desktop/mobile table of contents. Notes and works retain their original
  full-width, justified reading layouts.
- The shared layout emits canonical, robots, Open Graph, Twitter, RSS, and
  JSON-LD metadata with article-specific fields where supplied.
- Existing routes remain static, semantic, keyboard accessible, responsive,
  and compatible with reduced motion.

## Design Notes

- Commands: no runtime command changes.
- Queries: existing Astro collection reads remain the source of public content.
- API: no API changes.
- Tables: no database changes.
- Domain rules: undisclosed employers remain undisclosed.
- UI surfaces: homepage, work cards, experience detail, table of contents, and
  shared document head.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Astro content/schema and type checks |
| Integration | Static build and generated metadata inspection |
| E2E | Homepage, experience, SEO, and accessibility Cypress specs |
| Platform | Responsive browser inspection at 375px, 768px, and 1280px |
| Release | Biome plus production build |

## Harness Delta

No Harness policy change is expected. Record validation friction if the
unrelated guestbook API prevents a complete static build.

## Evidence

- `bunx astro check`: passed with 0 errors, warnings, or hints.
- Focused `biome check` across all changed Astro, Svelte, TypeScript, and
  Cypress files: passed.
- `bun run build`: type-check and bundle phases passed; prerender generated all
  four experience routes before the known guestbook API dependency stopped the
  build at `/guestbook` (`GET http://localhost:9090/api/v1/guestbook`).
- Cypress `experiences.cy.ts`, `seo.cy.ts`, and `responsive-review.cy.ts`: 12
  tests passed. Responsive proof covered 375px, 768px, and 1280px with no
  horizontal overflow, no work thumbnails, and the expected desktop/mobile TOC.
- Follow-up experience and responsive proof: 10 tests passed after simplifying
  the TOC hierarchy and restoring every authored homepage highlight.
- Layout restoration proof: Astro and focused Biome checks passed; six
  responsive tests confirmed four Featured Works entries while Notes and Works
  use their original full-width prose classes.
- Consistent homepage-list proof: Featured Works now uses the same row grid,
  borders, spacing, and arrow treatment as Latest Notes; six responsive tests
  passed at 375px, 768px, and 1280px.
- Broad design-system proof: shared page headers and editorial surfaces now
  cover collection indexes, tags, Uses, Now, Photos, Wakatime, IHSG, Eid,
  Design System, error pages, and all detail templates. Three Cypress tests
  visited the remaining public routes at 375px, 768px, and 1280px without
  horizontal overflow; the collection suite added six passing row-layout
  checks at mobile and desktop widths.
- Final experience proof: four experience tests and six responsive homepage /
  case-study tests passed after adding ruled highlight rows and widening the
  desktop table of contents.
- Final `bun run --cwd apps/web build`: passed, generating 91 static pages.
- Uses and Now refinement proof: both routes now use explicit editorial
  sections instead of dense utility-class prose. Uses presents its gallery and
  setup as a semantic description list; Now presents five numbered focus rows,
  contained quotations, and a scannable modification list. Focused Biome and
  Astro checks passed, the public-route Cypress suite passed at 375px, 768px,
  and 1280px, and settled screenshots were inspected at desktop and 375px.
  The production build passed and generated 91 static pages.
- Design-system guideline proof: the public reference now documents the actual
  content-first principles, semantic foundations, spacing rhythm, page-header,
  editorial-row, structured-content, long-form, media/data, responsive, and
  accessibility patterns used by current routes. Focused Biome and Astro checks
  passed; responsive Cypress proof passed at 375px, 768px, and 1280px. Settled
  desktop and mobile screenshots were inspected, including a follow-up mobile
  pass confirming spacing guidance and code examples do not clip. The
  production build passed and generated 91 static pages.
- IHSG availability-state proof: the live endpoint returned HTTP 200 while all
  five market records contained empty datasets and provider error messages.
  The client now falls back to the first usable market when one exists and
  presents one non-destructive availability notice when none do. Two focused
  Cypress scenarios passed, as did Biome, Astro check, the 375px / 768px /
  1280px responsive route suite, and the production build of 91 static pages.
- Activity skeleton proof: the pending contribution request now renders a
  shape-matched calendar and year-control skeleton with motion disabled under
  reduced-motion preferences. The focused loading scenario passed and its
  375px, 768px, and 1280px screenshots were inspected without page overflow;
  focused Biome, Astro check, and the 91-page production build also passed. The
  contribution spec's unrelated stale `Product/Devops` assertion remains red
  because that label no longer exists in the current homepage. Repository-wide
  Biome remains red on the same 11 pre-existing findings outside changed files.
- Existing `a11y.cy.ts`: 20 tests passed; three unrelated tests remain blocked
  by unavailable guestbook/Wakatime APIs and a stale theme-toggle selector.
  On the final run, all 17 public-route semantic checks passed and only the
  stale theme-toggle selector remained red (22 of 23 accessibility tests
  passed).
- Repository-wide `bun run lint:biome` remains red on pre-existing formatting
  and CSS import-order findings outside this story; all changed files pass the
  focused check.
