# Blended top navigation and flat lists

## Status

implemented

## Lane

normal

## Product Contract

At the top of a page the navigation bar blends into the canvas: it spans the content column with no border or shadow. Once the page scrolls, it returns to the existing bordered pill. Lists of notes, works, and experiences drop their card and sit flat on the canvas.

## Relevant Product Docs

- `DESIGN.md`
- `docs/product/website.md`

## Acceptance Criteria

- Below 10px of scroll, the bar has a transparent border and no shadow. From `sm` it spans `min(39rem, 100% - 3rem)`, the 42rem column less its gutters, with links at the left, the toggle at the right, and no divider.
- Past 10px, the bar shows `border-border` and `shadow-panel`, is as wide as its content from `sm`, and shows the divider before the toggle.
- Phones follow the same pattern: the viewport less 2rem at the top, then a pill around the avatar, toggle, and menu button (scrolled min-width 6rem under ~7rem of content).
- Hide-on-scroll-down, show-on-scroll-up, the view-transition snapshots, and reduced-motion behavior stay as they were.
- `Panel` renders no border, fill, shadow, or radius. Note, work, experience, and role rows drop their side padding and align to the column.
- The guestbook keeps its card.

## Design Notes

- UI surfaces: `Navbar.svelte`, `Panel.astro`, `NoteRow.astro`, `WorkRow.astro`, the experience rows in `pages/index.astro`, and the role rows in `pages/about.astro`.
- The bar is `fit-content` at every width; the top state holds it at the column width (the viewport less 2rem on phones) with `min-width`, and the scrolled state drops `min-width` to 15rem (6rem on phones). Transitioning `min-width` (a plain length) animates the shrink in every browser. A first version animated `width` through `interpolate-size: allow-keywords`; it only animated in Chromium, so Firefox snapped.
- Follow-up evidence: headless Brave at 1280px sampled the nav each frame on `/notes/`: 624 → 533 → 456 → 394 → 348 → 315 → 303px scrolling down, and 303 → 331 → … → 624px back up over about 300ms.
- Phone follow-up: at 375px the same probe measured 343 → 285 → 235 → 195 → 166 → 144 → 129 → 118 → 110px scrolling down and 110 → … → 343px back up.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable; markup and class state |
| Integration | Astro check and production build |
| E2E | `navigation.cy.ts` "Navigation surface" at 375px and 1280px; `collection-lists.cy.ts` asserts flat `/works` and `/notes` and a carded `/guestbook` |
| Platform | Home, `/notes`, `/works`, and `/about` at 375px, 768px, and 1280px, at the top and scrolled, in light and dark |
| Release | Focused Biome and `git diff --check` |

## Harness Delta

`scripts/bin/harness-cli` is still missing from this checkout, so intake, proof, and trace rows were not recorded.

## Evidence

- `git diff --check`: passed.
- Not run: Biome, Astro check, build, Cypress, and the responsive browser check. Bun is not installed on the authoring machine.
