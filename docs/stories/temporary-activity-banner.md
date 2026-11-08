# Temporary Activity Banner

## Status

implemented

## Lane

normal

## Product Contract

Until the owner restores the GitHub contribution calendar, the homepage leaves
it out: the `#opentowork` badge opens the intro, and `/images/banner.png`
closes the homepage card.

## Relevant Product Docs

- `docs/product/website.md`

## Acceptance Criteria

- The `#opentowork` badge sits above the intro paragraph and still opens the
  job preferences dialog by keyboard and pointer.
- The banner is cropped to the characters (650x195) and sits centred, resting
  on the card's inner bottom edge from 768px. Below
  768px, where the page frame is removed, it ends the page content.
- No page-level horizontal overflow at 375, 768, or 1280px.
- `GitHubContributionGraph` keeps working with the shared `OpenToWorkBadge`,
  so the calendar can return without rebuilding the badge.

## Design Notes

- The badge and dialog moved from `GitHubContributionGraph.svelte` into
  `OpenToWorkBadge.svelte`; the calendar renders it in its top row.
- The banner is decorative (`alt=""`), lazy-loaded, and has intrinsic
  `width`/`height` to reserve space. `md:-mb-8` cancels the card's bottom
  padding so the characters touch the card edge.
- The PNG background is transparent: the outer white was flood-filled from the
  top, left, and right edges, so enclosed whites such as faces stay opaque, and
  a 2px ring of line edges uses white-to-alpha to avoid a halo on dark pages.
- An earlier iteration covered the calendar at its exact size; the owner then
  chose this layout, and that `banner` prop was removed.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable |
| Integration | Build passes; the homepage renders the badge and banner |
| E2E | Cypress checks badge order, banner placement, overflow, and the dialog |
| Platform | Not applicable |
| Release | Not applicable |

## Harness Delta

None.

## Evidence

- `bunx cypress run --spec cypress/e2e/github-contributions.cy.ts`: 2 passed,
  6 calendar-only tests skipped while the calendar is off the homepage. The
  layout test checks badge-above-intro order, a loaded banner centred and
  resting within 1px of the card's inner bottom edge at 768 and 1280px, and no horizontal
  overflow at 375, 768, and 1280px. The job preferences test waits for the
  badge island to hydrate instead of the contributions request.
- Screenshots at 375, 768, and 1280px show the badge at the top of the intro
  and the characters at the bottom of the card.
- seo 5/5 and theme 6/6 pass; collection-lists keeps its homepage project test
  green, while its guestbook rows (live API) and gtcd thumbnail (owner's
  uncommitted `works/gtcd.mdx`) failures sit outside this change.
- `bun run lint:biome` passed (two existing CSS warnings, one info).
- `bun run --cwd apps/web build` passed: `astro check` 0 errors, 93 pages; the
  built homepage hydrates `OpenToWorkBadge` and has no contribution calendar.
- Owner follow-up: a width-only crop kept 261px of empty transparent space
  above the characters, so the empty top was trimmed (characters untouched)
  and the banner centred; the spec passed again, 2 passed and 6 skipped.
- Owner follow-up: the banner displays at medium width (`max-w-md`, 448px).
  Measured render: 448x134 at 768 and 1280px, 337x101 at 375px. The spec
  passed again, 2 passed and 6 skipped.
