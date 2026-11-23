# Typography and Mobile Navigation

## Status

implemented

## Lane

normal

## Product Contract

ekel.dev's typography uses Lora titles over Inter body text, a 16px body,
and a calmer article style. On phones the navigation
collapses into a menu button that opens a sheet of links.

## Relevant Product Docs

- `DESIGN.md` (Atmosphere, Typography, Panel, Navigation bar)
- `docs/product/website.md` (Navigation)

## Acceptance Criteria

- Inter loads as a variable font (100 to 900, normal and italic) and Lora as a
  variable font (400 to 700, normal); no weight the site uses is synthesized.
- Body text is 16px with 1.5 line-height; page titles are 24px, then 30px from
  768px, in Lora.
- Panel titles, page titles, and dialog titles set in Lora; row titles stay in
  Inter at 16px; secondary text is 14px and tertiary text 12px.
- Article prose keeps 16px and 1.75 line-height, sets headings in Lora, and
  stops text lines at 65ch while code blocks keep the column.
- Below 640px the bar shows the owner's name, the theme toggle, and an "Open
  menu" button; the sheet lists every link with the current page marked,
  closes with Escape, and returns focus to the button.
- From 640px the link row shows as before and the menu button is hidden.

## Design Notes

- Style: headings in Lora at weight 500 with balanced wrapping, body text in
  Inter at 16px, and articles with Lora semibold headings on an em scale,
  1.75 leading, and links that keep the text color with a 30% underline.
- The site previously loaded only weight 400 of Plus Jakarta Sans, so every
  medium and semibold weight was synthesized.
- The base heading rule covers `h1`, `h2`, and `role="heading"` at levels 1 and
  2, because bits-ui renders dialog and sheet titles as headings on `div`.
- Row titles stay in Inter, so list entries read as sans links under serif
  section titles.
- The 48rem column from the guestbook system stays; capping prose lines at
  65ch brings article lines near 78 characters at desktop widths.
- The phone bar's name link ("Haikel") follows the site's title suffix. The
  menu reuses the shared `Sheet` primitive from the top edge; the sideways
  scrolling link strip and its centering code are gone.
- OG images still render with Plus Jakarta Sans from `@fontsource`.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable |
| Integration | `astro check` and lint pass |
| E2E | Full Cypress suite; failures limited to ones that predate this story |
| Platform | Screenshots at 375 and 1280px in light and dark modes |
| Release | Live pages after deploy |

## Harness Delta

The local Harness CLI and `harness.db` are still missing from this checkout,
so no intake row or trace was recorded.

## Evidence

- New `navigation.cy.ts`: the phone menu lists 7 links with Notes marked
  current, Escape closes it and returns focus to the button, and a link
  navigates; at 640px the link row shows and the menu button hides.
- `typography.cy.ts` now asserts Inter on the root, Lora on `h1`, a 16px body
  with 24px line-height, 24px and 30px titles, and 16px prose with 28px
  line-height.
- Full `bunx cypress run` against the dev server: typography 3/3, navigation
  2/2, theme 6/6, markdown-processing 3/3, guestbook 2/2, seo 5/5,
  work-details 2/2, ihsg 2/2, github-contributions 2/2 (6 pending).
- Failures that predate this story, same tests as before: a11y 6 (removed
  routes, `/photos` without ImageKit secrets, the stale theme button check),
  experiences 4, responsive-review 7, public-routes-responsive 3,
  view-transitions 1 (needs a production build). collection-lists fails its 2
  guestbook cases because the local dev server points at a placeholder backend
  URL; the stubbed guestbook spec passes.
- Screenshots: home (375 light, 1280 light and dark), notes list, a note
  article (375 light, 1280 dark), about (375 dark), tools, works (375), and the
  open menu in both modes.
