# Design system consistency pass

## Status

implemented, unvalidated

## Lane

normal

## Product Contract

Every page follows one depth, motion, type-floor, media, chart, and link
system from `DESIGN.md`, with the shared primitives carrying the overlay
surface so call sites stop restyling it.

## Relevant Product Docs

- `DESIGN.md` (Typography, Alerts/fields/dialogs/sheets, Charts, Error pages,
  Photo gallery, Motion, Depth)

## Acceptance Criteria

- Depth: `DialogContent`, `SheetContent`, and `SelectContent` use `--popover`,
  a divider border, and `shadow-panel`; `DialogContent` takes the 10px radius.
  No `shadow-lg` or `shadow-md` remains. The ToC sheet uses the shared overlay,
  not its own light scrim, and no call site restyles a dialog, sheet, or select
  surface.
- Motion: no `transition-all` (reaction heart, `Progress`, `Badge`); color
  transitions carry no duration class (150ms default); the single-photo hover
  zoom and its 500ms timing are gone; the ToC active link no longer changes
  weight.
- Media: photos and video posters show in color everywhere, unframed, with the
  same hover scrim; no grayscale-until-hover.
- Text: nothing below 12px. Contribution graph months, days, legend, and
  tooltip, and the market chart's ticks and tooltips use `text-xs`.
- Charts: plot frames, skeletons, and empty states use `rounded-md`; both
  tooltips use the overlay surface; data marks stay square.
- Error pages: recovery links use a 14px medium muted label and a 16px medium
  title that turns accent on hover, without `no-underline!` or `font-semibold`.
- Links: inline links keep their sentence's color and weight with no overrides
  (guestbook intro, work Preview and Source, article prose). Tags are muted
  `#tag` links on every page; `/tags` drops its outlined chips for 14px tag
  links with a 24px tap height.

## Design Notes

- UI surfaces: `@ikuyo/ui` dialog, sheet, select, progress, and badge
  primitives; `OpenToWorkBadge`, `Lightbox`, `Navbar`, `TOC`, `TOCHeading`,
  `ReactionButton`, `Photo`, `PhotoGrid`, `Video`, `BackButton`,
  `GitHubContributionGraph`, `IHSGChart`, `pages/404.astro`, `pages/500.astro`,
  `pages/guestbook.astro`, `pages/works/[...slug].astro`, `pages/tags/index.astro`,
  and `prose.css`.
- The earlier audit listed these fixes; the owner's reply asked for links, a
  shared lightbox, and a slideshow, and that first pass treated the reply as
  the whole scope. The owner then asked why the consistency work had not
  reached every page, so this pass applies the rest.
- Kept on purpose: the sheet primitive's 200ms enter and exit, `shadow-xs` on
  outline controls, the 700 weight on the Arabic heading and
  the market index figure, and the guestbook avatar initials' semibold.
- The 12px day labels in the contribution graph keep `leading-[10px]` so they
  stay on their 10px rows; with labels on every other row the extra glyph
  height falls into the empty rows.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable; class changes |
| Integration | `bun run lint:biome`; `bun run --cwd apps/web build` |
| E2E | `github-contributions.cy.ts`, `ihsg.cy.ts`, `navigation.cy.ts`, `a11y.cy.ts`, `public-routes-responsive.cy.ts` |
| Platform | Home (graph, open-to-work dialog), a note (ToC sheet, single photo, photo grid), `/ihsg`, `/404` at 375px and 1280px, light and dark |
| Release | `git diff --check` |

## Harness Delta

Bun and `scripts/bin/harness-cli` are still missing, so no intake, proof, or
trace rows were recorded.

## Evidence

- `git diff --check`: passed.
- Not run: Biome, Astro check, build, Cypress, and the browser check.
