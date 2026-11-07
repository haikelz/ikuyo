# Installable PWA

## Status

implemented

## Lane

normal

## Product Contract

`ekel.dev` can be installed as a standalone app from Chromium browsers and added
to the iOS home screen. Its app icon reuses the favicon's は glyph so the
installed app matches the browser tab.

## Relevant Product Docs

- `docs/product/website.md`

## Acceptance Criteria

- Every page rendered by the shared Layout links `/manifest.webmanifest` and an
  Apple touch icon.
- The manifest declares a name, `start_url`, standalone display, and 192px,
  512px, and maskable 512px PNG icons, which meets current Chromium install
  criteria.
- The maskable icon keeps its glyph inside the centred 40% radius safe zone.
- No service worker is registered, so deploys never leave visitors on cached
  pages.
- The static site build succeeds.

## Design Notes

- UI surfaces: document head only; no visible page change.
- Icons are `#0d1117` Hiragino Sans W3 は on the favicon's `#effffd`, rendered
  once with Pillow and committed as static PNGs in `apps/web/public`.
- Manifest colours use the light page background `#faf9fc`; the existing
  `theme-color` meta tags keep per-scheme browser chrome.
- Offline support would need a service worker and a cache invalidation
  strategy; it stays out of scope until offline reading is requested.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable |
| Integration | Astro build output contains the manifest, icons, and head links |
| E2E | Cypress SEO spec fetches the manifest and every icon it lists |
| Platform | Not applicable |
| Release | Not applicable |

## Harness Delta

None.

## Evidence

- Rendered `icon-192.png`, `icon-512.png`, and `icon-maskable-512.png` with
  Pillow and Hiragino Sans W3; compared side by side with the favicon and
  checked the maskable glyph against a drawn 40% safe-zone circle.
- `bun run lint:biome` passed (two existing CSS warnings, one info); focused
  `biome check` on the changed files passed.
- `bun run --cwd apps/web build` passed: `astro check` 0 errors, 93 pages
  built. A first attempt failed only because `/wakatime` timed out against
  `backend.ekel.dev` during its redeploy; the retry passed.
- All 93 built pages link `/manifest.webmanifest` and `/icon-192.png`; the
  built manifest lists 192, 512, and maskable 512 icons, and the dev server
  serves it as `application/manifest+json`.
- `bunx cypress run --spec cypress/e2e/seo.cy.ts` passed 4 of 4, including the
  new manifest test.
- Full `bunx cypress run`: 59 of 84 passed. The 25 failures predate this story:
  specs visit removed routes (`/now`, `/uses`, `/design-system`), expect the
  removed `/tools` 3D gear, or assert older homepage counts. None touch the
  document head.
- `bun run test:web` cannot start in a non-TTY shell: `astro dev` detaches and
  exits, so `start-server-and-test` reports the server closed. Cypress ran
  against that detached dev server instead.
- No visible UI changed, so no responsive screenshots were taken.
