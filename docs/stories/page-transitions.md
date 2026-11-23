# Page Transitions

## Status

implemented

## Lane

normal

## Product Contract

Route changes animate: the old page lifts away, the new page rises in, going
back reverses the direction, the navigation bar stays put, and its
current-page highlight slides to the new link.

## Relevant Product Docs

- `DESIGN.md` (Motion & Interaction)
- `docs/product/website.md` (Page transitions)

## Acceptance Criteria

- Navigation stays a client-side swap through Astro's `ClientRouter`.
- Forward: old page out (160ms, -8px, fade), new page in (360ms, +16px to 0,
  60ms delay). Back uses the reversed keyframes.
- The nav bar never fades; from 640px the current-page pill slides between
  links beneath the labels.
- A scrolled page does not fly in from its scroll offset.
- Reduced motion removes every view-transition animation.
- No new dependency.

## Design Notes

- Owner rejected the Svelte Bits effects (dot grid, decrypted titles, star
  border, target cursor); all of it was reverted before this work.
- `<body>` had `transition:animate="initial"`, so Astro gave it a generated
  `view-transition-name`. The page then animated as a named element whose
  snapshot moved from its scroll offset, and the root cross-fade in
  `animations.css` covered only the canvas. Removing the directive makes the
  root snapshot the visible viewport.
- The pill is a `span` inside the active desktop link with
  `view-transition-name: nav-pill`; labels get unique names plus
  `view-transition-class: nav-label` so one rule lifts them above the pill.
  Phone links sit in the menu sheet, which closes on navigation, so they get
  no pill.
- Browsers without `view-transition-class` still run the transition; the
  pill can then pass over a label for the 360ms slide.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable |
| Integration | Lint and `astro check` pass |
| E2E | `view-transitions.cy.ts` updated to the new keyframes; not run, per the owner |
| Platform | Headless Chrome, slowed 10x, light and dark |
| Release | Live navigation after deploy |

## Harness Delta

The local Harness CLI and `harness.db` are still missing from this checkout,
so no intake row or trace was recorded.

## Evidence

- `bun run lint:biome`: no errors (2 warnings and 1 info that predate this
  story). `bunx astro check`: 0 errors, 0 warnings, 4 hints.
- Headless Chrome, Home to Works and back with animations slowed 10x: the
  animated pseudo-elements were `::view-transition-old(root)` `page-out`
  160ms, `::view-transition-new(root)` `page-in` 360ms, the `nav-pill` group
  360ms, and no fade on `site-nav`; the back navigation used `page-out-back`
  and `page-in-back`.
- Root group and both snapshots measured 1280x800 mid-transition with only
  the intended Y offsets.
- Frames at 140ms (real time) show the pill between Works and Notes under the
  labels, the old page lifting out and the new one rising; end frames are
  clean in light and dark.
- At normal speed a `window` marker survives navigation and Astro fires
  `before-swap`, `after-swap`, and `page-load`, so the swap stays
  client-side. Under the 10x slowdown the test page reloaded once; that did
  not occur at real speed.
