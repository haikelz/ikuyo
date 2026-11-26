# Shared lightbox, photo slideshow, and link roles

## Status

implemented, unvalidated

## Lane

normal

## Product Contract

One reusable viewer opens every photo, photo grid, and video. Photo grids, on
`/photos/` and inside notes and works, open it as a slideshow. Homepage links
follow the same standalone-link style, and the photos layout switch reuses the
shared toggle group.

## Relevant Product Docs

- `docs/product/website.md` (Photos page, Photo and video viewer)
- `DESIGN.md` (Buttons and links, Photo gallery, Lightbox)

## Acceptance Criteria

- `Photo`, `PhotoGrid`, and `Video` open `Lightbox.svelte`; none renders its
  own `<dialog>`. The viewer uses the `@ikuyo/ui` Dialog overlay, focus trap,
  scroll lock, Escape, and close button.
- A click beside the media closes the viewer, and focus returns to the tile of
  the last item shown.
- A grid with more than one photo shows previous, play or pause, and next
  buttons with a `n / total` counter. The arrow keys step, both ends wrap, and
  play advances every 4 seconds until paused or closed.
- The homepage social links and "Read case study" match "View all": 14px
  medium muted text, no underline, full-strength on hover.
- The photos layout switch is a single-choice `ToggleGroup`; pressing the
  active item keeps it chosen.
- The duplicated ImageKit URL helpers move to `utils/image.ts`, and the old
  `.lightbox-active` scroll lock and `--scrollbar-width` measurement are gone.

## Design Notes

- UI surfaces: `Lightbox.svelte`, `Photo.svelte`, `PhotoGrid.svelte`,
  `Video.svelte`, `PhotosPage.svelte`, `pages/index.astro`, `base.css`,
  `utils/image.ts`.
- The dialog content spans the viewport with `pointer-events-none` and gives
  its direct children `pointer-events-auto`, so clicks beside the media reach
  the overlay and close the viewer.
- Focus returns through `onCloseAutoFocus`, so it does not depend on the
  browser focusing a button on click, which Safari does not do.
- Auto-advance is off by default and stops on close. It meets WCAG 2.2.2
  through its pause control.
- Not done: swipe gestures (touch uses the buttons), and slideshows across
  separate `Photo` components in one note, which stay single-photo viewers.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable; component state |
| Integration | `bun run lint:biome`; `bun run --cwd apps/web build` (svelte-check covers the function bindings) |
| E2E | `a11y.cy.ts` slideshow and layout tests; `public-routes-responsive.cy.ts` |
| Platform | `/photos`, a note with a photo grid, a note with a single photo, and a work with a video at 375px and 1280px, light and dark |
| Release | `git diff --check` |

## Harness Delta

Bun and `scripts/bin/harness-cli` are still missing, so no intake, proof, or
trace rows were recorded.

## Evidence

- `git diff --check`: passed.
- Not run: Biome, Astro check, build, Cypress, and the browser check.
