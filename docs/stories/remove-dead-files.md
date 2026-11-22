# Remove Dead Files

## Status

implemented

## Lane

normal

## Product Contract

The repository carries no source, asset, primitive, dependency, or script that
nothing builds, imports, or serves.

## Relevant Product Docs

- `docs/product/website.md` (the stale Tools desk gear section is removed)

## Acceptance Criteria

- Every deleted file had no caller in HEAD or the working tree.
- Dependencies that only deleted files used leave both package manifests and
  `bun.lock`.
- `astro check` reports no errors and every route still renders.
- Built CSS loses only rules that came from deleted sources.

## Design Notes

- Svelte components without callers: `Banner`, `Tooltip` (local wrapper),
  `WakatimeChart`, `WakatimeToday`, `WakatimeWeekly`, and the `gear/` 3D
  viewer, which left `/tools` in `f281658`. Its `tools-gear` spec went with it.
- Public images left behind when `/uses` and `/now` were removed in
  `872ad6a`: `IMG_1205.png`, `IMG_1267.png`, `bad-apple.gif`,
  `hobby-related.jpeg`, `uses.png`.
- `@ikuyo/ui` primitives without callers: `input`, `textarea`, and `tooltip`
  (its last caller was the local wrapper above).
- Tailwind runs through `@tailwindcss/vite`; `postcss.config.js` and
  `@tailwindcss/postcss` in the web app were redundant.
- Dependencies dropped from the web app: `three`, `@types/three`,
  `tailwind-merge` (the UI package keeps its own), `@tailwindcss/postcss`.
- Root scripts `build:guestbook`, `dev:guestbook`, and `test:guestbook` pointed
  at a Moon project that does not exist.
- `env.d.ts` lost a `vite-plugin-pwa` reference (the site registers no service
  worker) and two font module stubs nothing imports. `packages/.gitkeep` and a
  commented-out font import in `Layout.astro` also went.
- GitHubContributionGraph stays: the website contract keeps it for restoring
  the homepage calendar. The Docker stack, Nix flake, parked Cloudflare
  workflow (`.yml.bak`), and AI tool configs stay as owner tooling.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable |
| Integration | `astro check` and lint pass |
| E2E | Not run; deleted files had no rendered caller |
| Platform | Build renders routes up to `/photos`; dev server serves the rest |
| Release | Not applicable |

## Harness Delta

The local Harness CLI and `harness.db` are still missing from this checkout,
so no intake row or trace was recorded.

## Evidence

- `bun install` removed 4 packages and saved the lockfile.
- `bun run lint:biome`: two existing warnings, one info.
- `astro check`: 0 errors, 0 warnings, 4 hints.
- `bun run build` rendered 404, 500, about, eid-al-fitr, experiences,
  guestbook, ihsg, notes, and og images, then stopped at `/photos` on the
  missing ImageKit secrets, as before.
- The dev server returned 200 for the routes the build never reached: `/`,
  `/tags/`, `/tags/linux/`, `/tools/`, `/wakatime/`, `/works/`,
  `/works/agendain/`, `/works/jadwal-sholat/`, `/rss.xml`, `/robots.txt`.
- Built CSS fell from 104,508 to 98,386 bytes. The 74 removed rules came from
  the deleted gear, Wakatime, and tooltip sources; `IHSGChart` keeps
  `cursor-grabbing`. The one added rule (`sm:mt-14`) comes from the About
  page change in the previous story.
