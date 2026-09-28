# Compact the shared website width

## Status

in_progress

## Lane

normal

## Product Contract

The public website uses a more compact centered shell while preserving the
existing readable measure for long-form writing and full-bleed media.

## Relevant Product Docs

- `docs/product/website.md`
- `DESIGN.md`

## Acceptance Criteria

- Main content shell and desktop navigation share a `max-w-3xl` boundary.
- Works and notes detail layouts fill the same shell as other public pages,
  with the ToC rendered outside the shell so it does not consume article width.
- Long-form prose without an adjacent ToC retains its existing reading measure.
- Mobile and tablet layouts remain responsive without horizontal overflow.
- Media/lightbox behavior is unaffected.

## Design Notes

- UI surfaces: shared layout, primary navigation, all public routes.
- Preserve the ReUI Sera editorial design system.

## Validation

| Layer       | Expected proof                                            |
| ----------- | --------------------------------------------------------- |
| Unit        | Not applicable; no new logic                              |
| Integration | Astro production build                                    |
| E2E         | Responsive route checks                                   |
| Platform    | Browser screenshots at mobile, tablet, and desktop widths |
| Release     | Not applicable                                            |

## Harness Delta

No harness changes required.

## Evidence

Add exact build, test, and browser evidence after implementation.
