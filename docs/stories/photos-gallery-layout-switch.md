# Photos gallery layout switch

## Status

implemented, unvalidated

## Lane

normal

## Product Contract

`/photos/` shows only the gallery. Photos default to square, cropped tiles, and
a switch changes to the existing bento (masonry) grid. The browser remembers
the choice. The square default and the switch follow `antfu.me/photos`.

## Relevant Product Docs

- `docs/product/website.md` (Photos page)
- `DESIGN.md` (Photo gallery)

## Acceptance Criteria

- No visible label, title, description, or divider above the gallery; a
  visually hidden `h1` "Photos" keeps one `h1` on the page.
- A `role="group"` labelled "Photo layout" holds two icon buttons, Square grid
  (`photos-layout-square`) and Bento grid (`photos-layout-masonry`), with
  `aria-pressed` on the active one.
- Square tiles use `aspect-square` and `object-cover`, in color, at 2, 3, and 4
  columns (phone, `md`, `lg`); the bento grid keeps its 2, 3, and 4 columns.
- The choice survives a reload through `localStorage` (`photos-layout`) and
  falls back to square tiles when storage throws.
- Photo grids in notes and works keep their 4:3 grayscale tiles.
- The lightbox opens from either layout and returns focus to the tile.

## Design Notes

- UI surfaces: `pages/photos.astro`, `PhotosPage.svelte`, `PhotoGrid.svelte`.
- `PhotoGrid` swaps its `masonry` boolean for `layout: "tiles" | "square" |
  "masonry"`. `tiles` stays the default for MDX content, and `/photos` was the
  only caller that passed `masonry`.
- Tile images now sit `absolute inset-0` with `object-cover` inside an
  `overflow-hidden` button, in place of the stacked grid. The tile keeps its
  ratio for any photo shape, in MDX grids too.
- The page is `client:only`, so reading `localStorage` while setting the
  initial state causes no hydration mismatch.
- antfu.me uses one icon button that toggles cover and contain inside the same
  grid, persisted as `antfu-gallery-view`. This site keeps two labelled
  buttons with `aria-pressed`, since antfu's button exposes only a `title`.
- Icons: lucide `LayoutGrid` and `LayoutDashboard`.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable; markup and component state |
| Integration | `bun run lint:biome`; `bun run --cwd apps/web build` |
| E2E | `a11y.cy.ts` "Photo gallery layout" and the photo dialog keyboard check; `public-routes-responsive.cy.ts` on `/photos` |
| Platform | `/photos` at 375px, 768px, and 1280px in both layouts, light and dark; a note with a photo grid |
| Release | `git diff --check` |

## Harness Delta

Bun and `scripts/bin/harness-cli` are still missing from this machine, so no
intake, proof, or trace rows were recorded.

## Evidence

- `git diff --check`: passed.
- Not run: Biome, Astro check, build, Cypress, and the browser check.
- Risk: `public-routes-responsive.cy.ts` asserts the `h1` is visible. Cypress
  treats a 1px `sr-only` box as visible, but nobody has confirmed it on this
  route.
