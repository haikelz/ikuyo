# Homepage job preferences dialog

## Status

Implemented locally; not committed or deployed.

## Lane

normal

## Product Contract

Homepage availability opens a dialog with the owner's six preferred roles and twenty technology names. Works independently of activity API success.

## Relevant Product Docs

- `docs/product/website.md`

## Acceptance Criteria

- Clicking or pressing Enter on the availability button opens the dialog.
- All supplied roles and stack labels appear without invented availability terms.
- Preferred roles use the same wrapped, bordered chip styling as technologies.
- Mobile content scrolls inside a bounded dialog; title and close remain visible.
- Escape and Close dismiss the dialog and return focus to the badge.
- Activity year selection retains its alignment and behavior.

## Design Notes

ReUI MCP `get_component(dialog)` confirms that Dialog is shadcn-owned. Follow registry example `c-dialog-2`, adapted to the shared bits-ui Svelte implementation. No new dependencies or runtime. Keep the trigger in the existing flex row and portal dialog content.

## Validation

- `bunx astro check`: zero errors/warnings; two existing hints.
- `bunx astro build`: 92 pages generated.
- Cypress production preview suite `github-contributions.cy.ts`: seven tests, including API failure, keyboard open/close, focus restoration, desktop/tablet/mobile bounds, and access to the final stack item by scrolling.
- Screenshots at 1280, 768 and 375 pixels inspected under `.amp/in/artifacts/open-to-work/`.
- Resize bounds assertions retry until layout settles; immediate measurements captured transient pre-resize positioning. Short mobile body uses an explicit shrinkable grid row.
- Biome remains blocked by pre-existing conflicting root configurations; no configuration changes made.
- Chip refinement: production build and seven Cypress tests pass; updated desktop/tablet/mobile captures inspected in `.amp/in/artifacts/job-chips/`. Compact chips fit at 375×640; short-screen scrolling is checked at 375×480 after reopening at that viewport.
