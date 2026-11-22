# Glass Top Bar and About Page

## Status

implemented

## Lane

normal

## Product Contract

Site navigation is a centered glass top bar of text links with the theme
toggle, and `/about/` introduces the owner with a profile picture, a short
biography, and the current role from the experiences collection.

## Relevant Product Docs

- `docs/product/website.md` (Navigation, About page)
- `DESIGN.md` (Navigation bar, Depth & Surface)
- `docs/stories/top-right-navigation-menu.md` (replaced)

## Acceptance Criteria

- The bar is fixed at the top center, as wide as its content, with at least a
  16px gutter at 375, 768, and 1280px.
- Links are text only: Home, About, Works, Notes, Tags, Photos, Guestbook.
  The current page carries `aria-current="page"` and an accent pill. Links
  keep their `data-cy` hooks; About is `about-btn`.
- The bar uses blur over page content and stays legible in light and dark
  modes.
- Narrow screens scroll the link strip inside the bar; the bar and the theme
  toggle never overflow the viewport, and the current page's link starts in
  view.
- `/about/` shows the GitHub profile picture above the biography on phones and
  to its right from `sm`, then the current role read from `experiences`
  records that end in `Present`.
- `/about/` has a 140 to 160 character description and its own OG image.

## Design Notes

- The owner asked for a glassmorphic bar, so `DESIGN.md` now allows blur on
  the navigation bar alone.
- The dropdown version's `DropdownMenu` primitive in `@ikuyo/ui` lost its only
  caller and was deleted; git history keeps it.
- Nav links render in static HTML again, which removes the dropdown version's
  crawl trade-off.
- The biography restates facts from the homepage intro and experience records
  only; the owner should review its wording.
- Theme spec option clicks skip Cypress's scroll-into-view. Scrolling the page
  made the open list re-anchor to the fixed bar on every retry, so Cypress
  read it as animating; visitors cannot scroll while the list is open.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable |
| Integration | `/about/` and `/og/about.png` build; lint passes |
| E2E | Layout check at three widths; theme, seo, a11y, and view-transitions specs |
| Platform | Not applicable |
| Release | Live `/about/` and nav after deploy |

## Harness Delta

The local Harness CLI (`scripts/bin/harness-cli`) and `harness.db` were
missing from this checkout, so no intake row, trace, or backlog entry was
recorded. Reinstalling needs the upstream installer, which the owner runs.

## Evidence

- A temporary Cypress spec visited `/`, `/about/`, and `/guestbook/` at 375,
  768, and 1280px: the bar centered within 1px, kept at least 15px gutters,
  showed one `aria-current` link inside the strip, and kept the strip and
  toggle inside the bar. 9/9 passed. At 375px, `/guestbook/` starts with
  Guestbook in view.
- Screenshots: light mode with the bar blurring scrolled `/about/` text;
  mobile, tablet, and desktop in dark mode.
- `bunx cypress run`: theme 6/6, seo 5/5. a11y: the navigation half of
  "announces current navigation" passes; its theme half expects a
  `Switch to` button that the Select toggle replaced before this story. The
  other a11y failures are older: removed routes (`/now`, `/uses`,
  `/design-system`) and `/photos`, which needs ImageKit secrets.
- view-transitions: the expected path is now `/works/`, and navigation passes.
  Its stylesheet check needs a production build.
- At `HEAD`, the theme spec's dark-mode test passed in 4099ms against a 4050ms
  retry window; with the option-click fix, it takes about 550ms.
- `bun run lint:biome` passed (two existing CSS warnings, one info).
- `bun run --cwd apps/web build` with `PUBLIC_GOATCOUNTER_SRC` and
  `BACKEND_API_URL` set rendered `/about/index.html` and `/og/about.png`, then
  stopped at `/photos`. This checkout has no `.env`, so `IMAGEKIT_*` are
  unset.
