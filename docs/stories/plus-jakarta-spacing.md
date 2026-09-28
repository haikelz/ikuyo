# Plus Jakarta Sans Reading Rhythm

## Status

in_progress

## Lane

normal

## Product Contract

All public pages use a more relaxed reading rhythm inspired by the homepage while retaining compact metadata and the existing heading hierarchy and layouts.

## Relevant Product Docs

- `docs/product/website.md`
- `DESIGN.md`

## Acceptance Criteria

- Shared body and supporting-text line-height tokens provide more breathing room across page templates.
- Long-form prose preserves the homepage's relaxed leading and gains consistent paragraph separation.
- Page titles, compact labels, code, and interactive controls retain their existing hierarchy and density.
- Public sitemap routes render at mobile, tablet, and desktop widths without typography clipping or horizontal overflow.
- The Astro check and static build pass.

## Design Notes

- Preserve Plus Jakarta Sans and the ReUI Sera monochrome editorial direction.
- Do not change copy, route composition, or content widths.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable |
| Integration | `bun run --cwd apps/web build` |
| E2E | Sitemap routes inspected at 375px, 768px, and 1280px |
| Platform | Not applicable |
| Release | Not applicable |

## Harness Delta

- None.

## Evidence

- Pending validation.
