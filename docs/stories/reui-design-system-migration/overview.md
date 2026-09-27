# ReUI Design System Migration

## Current Behavior

Ikuyo is a static Astro 6 site with Svelte 5 islands, Tailwind CSS 4, and shared
shadcn-svelte primitives in `packages/ui`. `DESIGN.md` defines the existing
Geist-based monochrome visual system.

## Target Behavior

Replace the current design system across public pages and shared UI with a
ReUI-based system, including design tokens, typography, surfaces, component
states, and responsive behavior. The confirmed approach keeps Astro and Svelte
and implements ReUI's Sera visual system through project-owned tokens and
primitives.

## Affected Users

- Visitors using the personal website on mobile, tablet, and desktop.
- The site owner maintaining shared UI and content pages.

## Affected Product Docs

- `docs/product/website.md`
- `DESIGN.md`
- `docs/ARCHITECTURE.md` only if the selected path changes framework boundaries.

## Non-Goals

- Changing routes, content, integrations, or site behavior unrelated to visual
  and component-system migration.
- Replacing Astro's static generation unless the selected approach requires it.
