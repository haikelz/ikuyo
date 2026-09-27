# Refine long-form table of contents layout

## Status

implemented

## Lane

normal

## Product Contract

Long-form pages must keep the table of contents separate from article text on
desktop while preserving usable contents navigation on smaller screens.

## Relevant Product Docs

- `docs/product/website.md`
- `DESIGN.md`

## Acceptance Criteria

- Desktop table-of-contents rail does not overlap page headings or article text.
- Long-form text uses a readable capped width across notes, works, and
  experiences.
- Mobile users retain a labelled, keyboard-accessible table-of-contents sheet.

## Design Notes

- UI surfaces: note, work, and experience detail pages.
- Keep Astro/Svelte and the existing sheet primitive.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable; no new logic |
| Integration | Astro production build |
| E2E | Focused responsive route checks and ToC sheet interaction |
| Platform | Manual browser inspection at mobile and desktop widths |
| Release | Not applicable |

## Harness Delta

No harness changes required.

## Evidence

Before screenshots showed the desktop ToC rail over article text at 1440px and
the article spanning into the rail. Evidence captured in
`.playwright-cli/page-2026-09-27T04-04-28-075Z.png`.

After screenshots:

- Desktop note at 1440px: `.playwright-cli/page-2026-09-27T04-08-42-549Z.png`
- Note at 1280px: `.playwright-cli/page-2026-09-27T04-09-39-858Z.png`
- Long experience at 1280px:
  `.playwright-cli/page-2026-09-27T04-09-42-807Z.png`
- Mobile note at 390px: `.playwright-cli/page-2026-09-27T04-08-45-102Z.png`

Validation:

- `bun run --cwd apps/web build` — passed, 92 routes generated.
- `bunx biome check src/components/svelte/TOC.svelte 'src/pages/notes/[...slug].astro' 'src/pages/works/[...slug].astro' 'src/pages/experiences/[...slug].astro'` from `apps/web` — passed.
- `bunx cypress run --spec cypress/e2e/public-routes-responsive.cy.ts` from `apps/web` — passed, 3/3 responsive checks.
- Playwright mobile sheet interaction — opened, followed the “Why Migrate to Moonrepo?” fragment link, confirmed the hash updated and sheet closed; console had 0 errors.
- Playwright 1280px geometry — article right edge 973px, ToC left edge 1037px, 64px gap.
- `git diff --check` — passed.
