# Photo-matched 3D desk gear on Tools

## Status

implemented

## Lane

normal

## Product Contract

Add two interactive, photo-referenced 3D objects to `/tools`: the blue FiiO
SNOWSKY ECHO MINI and the owner's NOIR Timeless82 V1 keyboard. Preserve the
existing app links and the site's current design system.

## Relevant Product Docs

- `docs/product/website.md`
- `DESIGN.md`

## Acceptance Criteria

- Both devices use real geometry, with pointer/touch rotation and zoom.
- The player preserves the blue rails, dark sidewalls, front branding, and
  the screen content from the supplied photo.
- The keyboard preserves the 82-position layout, pale case and caps, Japanese
  legends, black spacebar/Enter/arrows/logo keys, twelve open function-row
  sockets, two exposed switches, four indicators, and upper-right display.
- Native buttons provide keyboard-accessible view, rotation, and zoom controls.
- Graphics load only when visible, render on demand, and dispose on unmount.
- Device names and descriptions remain readable without JavaScript or WebGL.
- `/tools` has no horizontal overflow at mobile, tablet, and desktop widths.

## Design Notes

- Route composition stays in Astro; the Svelte viewer owns interaction.
- Three.js owns meshes, lighting, and the camera. No React runtime or 3D
  hosting service is introduced.
- Visible proportions are reconstructed from the five supplied photographs;
  this is a visual model, not a dimension-certified manufacturing model.
- The player screen is a perspective-corrected crop of the supplied image.
  Surrounding desk items and earphones are not part of either model.
- No automatic rotation or simulated audio playback.

## Validation

- Static: `bun run lint:biome` and `bun run --cwd apps/web build`.
- Browser: both rendered models, rotation/zoom/reset/top controls, lazy loading,
  keyboard focus, theme variants, WebGL fallback, and responsive layout.
- Regression: `bun run test:web` and focused `/tools` interaction coverage.
- Inspect final screenshots at mobile, tablet, and desktop widths.

## Harness Delta

- Intake #46; story `tools-3d-gear`.

## Evidence

- `scripts/bin/harness-cli story complete tools-3d-gear` passed fresh
  `bun run --cwd apps/web build`: zero type-check errors and 92 static pages.
  Two existing Astro hints and bundle/source-map warnings remain.
- From `apps/web`, `bunx biome check src/components/svelte/GearModel.svelte
  src/components/svelte/gear/gear-models.ts
  src/components/svelte/gear/gear-viewer.ts src/pages/tools.astro
  cypress/e2e/tools-gear.cy.ts` passed for all five changed code/test files.
- `CYPRESS_baseUrl=http://127.0.0.1:3002 bunx cypress run --browser chrome
  --spec cypress/e2e/tools-gear.cy.ts` passed 3/3 tests against the production
  preview after the final no-JavaScript correction. Real WebGL pixels confirm
  zoom direction, camera rotation, top view, and exact reset. Initial HTML
  includes the JavaScript instruction without a loading message;
  WebGL-disabled fallback, focus, and existing app links pass.
- The same focused spec passed 3/3 in Electron with
  `CYPRESS_baseUrl=http://127.0.0.1:3002 bunx cypress run
  --spec cypress/e2e/tools-gear.cy.ts` after the final correction.
- Before the final fallback correction,
  `CYPRESS_baseUrl=http://127.0.0.1:3002 bun run test:web` ran 83 tests:
  66 passed, including all three gear tests in Electron; 17 failed in the
  existing accessibility, collection, experience, and responsive specs.
  Failures concern removed routes, outdated project/experience counts, and
  old theme/menu selectors. These unrelated contracts were not rewritten.
- All 17 failures reproduce with matching test names and errors against
  archived HEAD application source. That baseline has five additional failures
  from unavailable backend credentials. The comparison is recorded in
  `.amp/in/artifacts/tools-baseline-comparison.json`; validation-baseline
  repair is tracked separately in Harness backlog #3.
- `bun run lint:biome` still reports 24 errors in unchanged files. An archived
  HEAD copy also reports the same 24 errors with
  `bunx biome check . --vcs-enabled=false` from its `apps/web` directory.
- Actual Chrome input events verify mouse dragging, two-finger rotation, and
  pinch zoom. A single-finger gesture scrolls the page from 952px to 1064px
  without changing the model; spreading two fingers increases opaque model
  pixels from 22,571 to 53,349 without scrolling the page.
- Production screenshots were inspected at 390px, 768px, and 1440px, plus
  desktop top view and light mode. Measured document width matches the
  viewport at 320px, 390px, and 768px; all model controls have 44px targets.
- With JavaScript disabled in the production browser, both device names,
  descriptions, the enable-JavaScript message, and original app links remain
  readable. Loading starts only after client mounting, so it does not appear
  alongside the no-JavaScript instruction. The replacement `tools-no-js.png`
  was captured and inspected while the disabling CDP session remained attached.
  No automatic rotation or audio playback is added.
- The rounded-cap surface uses the sidewall's arc samples to close its corners;
  navigation/arrow cutouts do not overlap. The final screenshots replace
  intermediate renders with corner gaps.
- The focused Impeccable detector reports no findings. Existing design tokens
  and shared buttons remain unchanged; physical device colors follow the photos.
- Review captures and command logs are local under `.amp/in/artifacts/`,
  including `tools-desktop.png`, `tools-keyboard-top.png`, `tools-light.png`,
  mobile/tablet captures, `tools-no-js.png`, `tools-complete.log`,
  `tools-gear-cypress-final.log`, `tools-gear-electron-final.log`, and
  `tools-web-tests-final.log`.
- No independent unit, integration, or platform suite was run. Touch input was
  checked in Chrome emulation, not on physical iOS/Android hardware.
- Delivery is local: the production preview runs at
  `http://127.0.0.1:3002/tools`. Changes are not committed, pushed, or deployed.
