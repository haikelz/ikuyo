# Shared ReUI Frame

## Status
Implemented locally

## Lane
Normal

## Product Contract
Adapt the ReUI Frame composition to the existing Svelte runtime without React
or new dependencies. Keep the incumbent visual system and page behavior.

## Relevant Product Docs
- `docs/product/website.md`
- `DESIGN.md`

## Acceptance Criteria
- Export Frame, FramePanel, FrameHeader, FrameTitle, FrameDescription, FrameFooter from `@ikuyo/ui`.
- Support default/ghost, sm/default/lg spacing, stacked panels, dense outer padding, custom radius and native attributes.
- Use Frame on every public HTML page through shared Layout without hydrating the static container.
- Preserve client-side guestbook loading and responsive rows.

## Design Notes
Native Svelte adaptation of https://reui.io/r/frame.json, using existing tokens,
class merging, bindable element references and children snippets. `dense`
removes outer frame padding; it does not remove panel content padding.

## Validation
Astro check, targeted Cypress guestbook tests and desktop/mobile render inspection.

## Harness Delta
Intake and story proof recorded in local Harness.

## Evidence
- `bunx astro check`: zero errors and warnings; two existing hints.
- Cypress Frame and guestbook specs: four tests passed.
- Frame border/radius/spacing computed styles checked at 390px and 1280px.
- Desktop/mobile Frame screenshots and guestbook screenshot inspected successfully.
- Site-wide adoption: 92 production HTML pages contain exactly one page Frame.
- 17 representative routes checked at 390px and 1280px; Frame is static and no duplicate page container exists.
- Production preview: page-frame, guestbook, SEO, IHSG and contribution suites passed (15 tests).
- Dev-server IHSG module loading failed; the production build and both IHSG browser tests passed on production preview.
- Repository Biome formatting is blocked by existing nested-root configuration errors; no config migration performed.
- Changes are local; not committed or deployed.

## Mobile refinement
- Below 768px page Frame and panel render as display: contents, with zero padding and no border/background. Tablet/desktop remain framed.
- Latest Astro check and 92-page production build passed.
- Latest mobile route sweep and 767/768px breakpoint test passed. Desktop sweep reached Photos then timed out on its page load; the rendered gallery and Frame were visible, but the full sweep did not complete.
- Final mobile and desktop Works screenshots inspected: mobile is unboxed with normal gutters; desktop retains the Frame.
