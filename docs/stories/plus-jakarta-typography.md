# Refine Site Typography for Plus Jakarta Sans

## Status

in_progress

## Lane

normal

## Product Contract

Public pages use a coherent, responsive typography system tuned for Plus Jakarta Sans, with clear heading hierarchy, readable body leading, and relaxed long-form text.

## Relevant Product Docs

- `docs/product/website.md`
- `DESIGN.md`

## Acceptance Criteria

- The design contract names Plus Jakarta Sans and defines the site's type scale and typographic roles.
- Shared Tailwind typography tokens provide consistent sizes, line heights, and heading tracking across pages.
- Long-form notes and works prose remains full-width, readable, and left-aligned.
- Mobile, tablet, and desktop renders show no clipping, overflow, or broken heading hierarchy.
- The Astro check and static build pass.

## Design Notes

- Preserve the current ReUI Sera, monochrome editorial direction and existing content widths.
- Keep Geist Mono for dates, code, indexes, and compact technical labels; preserve Noto Naskh Arabic for Arabic content.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable |
| Integration | `bun run --cwd apps/web build` |
| E2E | Built pages inspected at 375px, 768px, and 1280px |
| Platform | Not applicable |
| Release | Not applicable |

## Harness Delta

- None.

## Evidence

- Pending validation.
