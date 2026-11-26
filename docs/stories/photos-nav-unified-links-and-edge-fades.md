# Photos in the navigation bar, unified links, and edge fades

## Status

implemented, unvalidated

## Lane

normal

## Product Contract

Photos moves from the footer to the primary navigation, and `/photos/` fills
the viewport width. Every inline link follows one rule, pills take the 8px
button radius, and neutral gradients fade content under the navigation bar and
tint the footer.

## Relevant Product Docs

- `DESIGN.md`
- `docs/product/website.md`

## Acceptance Criteria

- The navigation bar and phone menu sheet list Home, About, Works, Notes, and
  Photos; the Photos link has `data-cy="photos-btn"` and marks `/photos/` as
  the current page. The footer no longer links Photos.
- The footer's Astro and Svelte links carry their own accessible names.
- `/photos/` drops the 42rem column cap; other routes keep it.
- Inline links keep their text color and a 35% underline that darkens on hover,
  with no per-link hover color. Prose links use the same 35% line. List titles
  turn accent on hover, the tools titles included.
- Count pills, badges, Open-to-work chips, `/tags` chips, and the reaction
  button use `rounded-md`. Avatars and status dots stay round. The reaction
  button uses `transition-colors`, not `transition-all`.
- A fixed 6rem strip under the bar fades from the canvas to transparent, stays
  out of pointer events, and swaps without fading on route changes. The footer
  background fades from the canvas to `--secondary`.

## Design Notes

- UI surfaces: `Navbar.svelte`, `Footer.astro`, `Layout.astro`,
  `pages/photos.astro`, `base.css`, `prose.css`, `animations.css`, `Panel.astro`,
  `GuestbookEntries.svelte`, `OpenToWorkBadge.svelte`, `ReactionButton.svelte`,
  `pages/tags/index.astro`, `pages/tools.astro`, the inline links on the home,
  guestbook, note, and work pages, and the shared `Badge` primitive.
- `Layout` joins `className` with `class:list` and no class merging, so
  `/photos/` passes `max-w-none!` to beat `max-w-2xl`.
- The fifth link widens the `sm` link row from ~19rem to ~23rem (estimated, not
  measured), so the scrolled floor moves from 15rem to 19rem, and the Cypress
  shrink check allows 70% of the top width instead of 60%.
- The phone sheet spec expected 7 links while the nav listed 4; it now expects 5.
- The owner chose the options marked recommended: one link rule, every pill
  shape, and the neutral edge fade over an accent glow or gradient hairlines.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable; markup and class state |
| Integration | `bun run lint:biome`; `bun run --cwd apps/web build` |
| E2E | `navigation.cy.ts`, `a11y.cy.ts`, `public-routes-responsive.cy.ts`, `view-transitions.cy.ts` |
| Platform | Home, `/photos`, `/tags`, and a note at 375px, 768px, and 1280px, at the top and scrolled, in light and dark |
| Release | `git diff --check` |

## Harness Delta

`scripts/bin/harness-cli` and Bun are both missing from this machine, so
intake, proof, and trace rows were not recorded and the Bun checks did not run.

## Evidence

- `git diff --check`: passed.
- Not run: Biome, Astro check, build, Cypress, and the responsive browser
  check. Bun, Moon, `node_modules`, and the Harness CLI are absent.
