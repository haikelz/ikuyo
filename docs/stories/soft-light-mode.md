# Soft light mode

## Status

implemented

## Lane

normal

## Product Contract

Light mode uses a warm, low-glare paper canvas instead of near-white slate, so long reading sessions strain the eyes less. Dark mode stays unchanged.

## Relevant Product Docs

- `DESIGN.md`
- `docs/product/website.md`

## Acceptance Criteria

- No light-mode surface token is pure white; the canvas is `oklch(0.96 0.012 85)` (`#f5f1e9`).
- Light neutrals (`--background`, `--card`, `--popover`, `--secondary`, `--muted`, `--accent`, `--border`, `--input`, `--invert-foreground`) share hue 85 and keep their previous lightness steps.
- `--foreground`, `--muted-foreground`, and `--primary` keep WCAG AA (4.5:1) on the canvas, card, muted, and hover surfaces.
- The light `theme-color` meta and the web manifest match the canvas.
- Dark-mode tokens and the indigo accent stay unchanged.

## Design Notes

- UI surface: every route through `apps/web/src/styles/theme.css`.
- Status pairs (info, success, warning) and chart colors keep their values.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Contrast script over the new light tokens |
| Integration | Astro check and production build |
| E2E | Existing web suite; no Cypress contract change |
| Platform | Homepage, a note, and `/guestbook` in light mode at 375px, 768px, and 1280px |
| Release | Focused Biome and `git diff --check` |

## Harness Delta

`scripts/bin/harness-cli` is still missing from this checkout, so intake, proof, and trace rows were not recorded.

## Evidence

- OKLCH to sRGB contrast check (WCAG 2 relative luminance): ink 14.42–16.49, muted text 4.88–5.58, and primary 4.94–5.65 across the canvas, card, muted, and hover surfaces. All pass AA.
- `git diff --check`: passed.
- Not run: Biome, Astro check, build, Cypress, and the responsive browser check. Bun is not installed on the authoring machine.
