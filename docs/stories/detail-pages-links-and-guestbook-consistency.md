# Detail pages and guestbook consistency

## Status

implemented, partially validated

## Lane

normal

## Product Contract

Notes and Works detail pages share the page header every other route uses,
and the guestbook list sits flat on the canvas like the Notes and Works lists.

## Relevant Product Docs

- `DESIGN.md` (Page header, Panel, Buttons and links, Error pages, Depth)

## Acceptance Criteria

- Notes and Works detail pages render `PageHeader` (label, title, record
  description) and `ArticleMeta` (metadata line with a `<time>` date, then
  `#tag` links between hairlines). The invalid `space-x` class, the misplaced
  `tabular-nums`, and the `prose-pre` overrides that doubled the code-block
  border are gone.
- `ReactionButton` uses the `@ikuyo/ui` outline `Button` with Svelte 5 runes,
  `aria-pressed`, no scale on the heart, and guarded `localStorage`.
- `GuestbookEntries` drops the card (border, `bg-card`, `shadow-panel`,
  radius, side padding) for the Panel layout; its dates are 14px like other
  row dates.

## Design Notes

- Experience detail pages still use their own header markup; moving them to
  `PageHeader` and `ArticleMeta` is a follow-up.
- The owner first asked for an underline on every link (commit `dc51631`),
  asked to revert it, then settled on a split by destination: external
  links take the homepage social-link look (medium, muted, no underline,
  full strength on hover) through one `a[href^="http"]` rule in `base.css`
  and `prose.css` that excludes `https://ekel.dev`; internal links take the
  underline. Navigation controls keep their fills and no underline.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable; markup and class changes |
| Integration | `bun run lint:biome`; `astro build` |
| E2E | `collection-lists`, `guestbook`, `work-details`, `navigation`, `experiences`, `a11y`, `typography` |
| Platform | Note, work, guestbook, home, 404 at 375, 768, and 1280px |

## Harness Delta

`scripts/bin/harness-cli` is still missing (`scripts/bootstrap-harness.sh`:
"Harness CLI is missing; install Harness again from its pinned release"), so
no intake, proof, or trace rows were recorded. Test tooling friction found:

- `bun run test:web` cannot start a server here: `start-server-and-test dev`
  runs `npm run dev`, and npm is not installed.
- `astro dev` now daemonizes and exits, so `start-server-and-test` reports
  "server closed unexpectedly" even with `bun run dev`.
- `cy.screenshot()` times out in this environment, failing any spec that
  screenshots (including `typography.cy.ts`) and masking real failures unless
  `screenshotOnRunFailure=false`.
- `bun run --cwd apps/web build` stops at `astro check`, which refuses the
  installed TypeScript 7.0.2 although `package.json` pins `~6.0.3`.

## Evidence

- `astro build`: passed, 94 pages.
- `bun run lint:biome`: fails only on pre-existing `moon.yml` and
  `PhotoGrid.svelte` formatting; same failure without these changes.
- `work-details.cy.ts`: 2 passing.
- `typography.cy.ts`: 3 failing, all on its own `cy.screenshot()` timeout.
- `collection-lists`, `guestbook`, `navigation`, `experiences`, `a11y`
  (screenshots off, against `astro dev`): 30 passing, 16 failing. The
  unchanged baseline (changes stashed) fails the same 16 tests: project
  classification, note tag links, guestbook refresh, nav surface and menu,
  experience slash-less URL expectations, `/now`, `/uses`, and
  `/design-system`, the slideshow, and the theme control. All six
  collection-panel checks pass, including the flat guestbook.
- Comment cleanup: removed comments that restated the code (style section
  labels, JSDoc that repeated names and types, shadcn `//` export separators,
  eslint directives Biome ignores). Kept comments that explain a constraint,
  the shadcn-svelte `---break---` CSS markers, and the toggle-group cast note.
  `packages/ui` Biome check passes; `astro build` passes.
- Link split: a temporary Cypress spec read computed styles on `/`,
  `/guestbook`, `/notes`, and `/notes/dari-zsh-ke-fish`: homepage social
  links (14px), footer Astro credit, guestbook intro link, and article
  links to other sites have no underline and weight 500; note row titles,
  the footer Guestbook link, and detail page tags are underlined. 3 passing;
  spec removed after the run.
