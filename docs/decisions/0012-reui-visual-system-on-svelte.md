# Adopt ReUI Sera visual system on the existing Astro and Svelte stack

Date: 2026-09-27

## Status

Accepted

## Context

The requested ReUI migration spans Ikuyo's public design system. ReUI's current
official component registry targets React 19, while Ikuyo uses Astro 6, Svelte
5, Tailwind CSS 4, and shadcn-svelte. Replacing the framework boundary was not
part of the requested scope.

## Decision

Keep Astro and Svelte. Adopt ReUI's Sera editorial direction, semantic token
model, and component-state conventions in the existing Svelte and Astro system.
Do not install the official React components or add a React runtime.

## Alternatives Considered

1. Integrate React into Astro and replace the shared Svelte UI with official
   ReUI React components.
2. Keep Astro and Svelte and implement ReUI's design system and component
   conventions in the existing UI layer. Selected by the site owner.

## Consequences

Positive:

- Replaces the site-wide visual contract while preserving its static Astro and
  Svelte delivery model.
- Avoids shipping an additional framework runtime for a static portfolio.
- Keeps existing content routes and interactive islands intact.

Tradeoffs:

- The shared components follow ReUI's design language but are not official
  React registry components.
- Upstream ReUI component code and API updates cannot be consumed directly.

## Follow-Up

- Update `DESIGN.md`, site tokens, shared Svelte primitives, and public page
  templates together.
- Keep this distinction visible in product and design documentation.
