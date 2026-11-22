# Guestbook Design System

## Status

implemented

## Lane

high-risk

## Product Contract

ekel.dev uses the design system of `guestbook.ekel.dev` in place of ReUI
Sera: its palette, type scale, column layout, and bordered list panels.

## Relevant Product Docs

- `DESIGN.md`
- `docs/product/website.md` (Design system, Reading and portfolio patterns)
- `docs/decisions/0013-guestbook-design-system.md` (supersedes 0012)

## Acceptance Criteria

- Theme tokens carry the guestbook `--gb-*` values in light and dark modes,
  with a 10px radius and the guestbook panel shadow.
- Body text is 14px with 1.5 line-height; article prose is 16px, left-aligned;
  page titles are 24px on phones and 28px from `sm`.
- Pages sit in a 48rem column with no page frame; the footer spans the
  viewport with a top divider.
- Record lists (experience, projects, notes, tag archives, guestbook messages,
  current role) render as panels with a heading row and divided rows.
- Mono uppercase eyebrows are gone; labels are muted medium text and numbers
  use tabular figures.
- Focus shows a 2px accent outline with a 2px offset; no control drops focus
  without a replacement.
- The navigation keeps the owner's centered content-width layout with the
  guestbook topbar surface.

## Design Notes

- Source: the live guestbook CSS (`/_next/static/css/*.css`), read for its
  `--gb-*` tokens and component rules. No local source exists.
- `--gb-*` values map onto shadcn token names so `@ikuyo/ui` restyles without
  API changes; `--accent` stays the hover fill and `--primary` the brand
  accent.
- Global element styles moved into `@layer base`, so utilities override them
  without `!`. Four photo and video buttons had `outline-none` that the old
  unlayered rule overrode; they now show the outline on purpose.
- Deleted: the `Frame` primitive (its only caller was the page shell), the
  unused `components/Card.astro`, and the `frame` and `page-frames` specs that
  tested the retired shell.
- The homepage banner now rests on the footer's top divider instead of the
  page card's bottom edge.
- The navigation stays centered and content-width as the owner asked one story
  earlier, instead of the guestbook's full-width topbar with a brand mark.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable |
| Integration | `astro check` passes; lint passes |
| E2E | Full Cypress suite; failures limited to ones that predate this story |
| Platform | Screenshots at 375 and 1280px in light and dark modes |
| Release | Live pages after deploy |

## Harness Delta

The local Harness CLI and `harness.db` are still missing from this checkout,
so no intake row, decision row, or trace was recorded.

## Evidence

- Screenshots of home (both modes, desktop and 375px), about (dark), notes,
  a note article, works (375px dark), guestbook, and tags: no horizontal
  overflow; panels, pills, and the topbar surface match the guestbook.
- Full `bunx cypress run` against the dev server: collection-lists 8/8,
  github-contributions 2/2, guestbook 2/2, markdown-processing 3/3, seo 5/5,
  theme 6/6, typography 3/3, work-details 2/2, ihsg 2/2 (after a dev-server
  restart cleared a hot-reload error).
- Specs updated to the new contract: collection-lists (rows in a panel),
  typography (14px body, 16px prose, 24/28px titles), github-contributions
  (banner on the footer divider).
- Failures that predate this story: a11y 6 (removed routes `/now`, `/uses`,
  `/design-system`; `/photos` needs ImageKit secrets; a `Switch to` theme
  button that no longer exists), experiences 4 (slashless URLs, old title
  suffix, an entry without a detail page), responsive-review 7 (expects 5
  homepage projects, now 7; expects a bottom ToC sheet, the sheet opens from
  the right), public-routes-responsive 3 (`/uses` 404), tools-gear 3 (removed
  3D gear), view-transitions 1 (needs a production build).
- `bun run lint:biome` passed (two existing CSS warnings, one info).
