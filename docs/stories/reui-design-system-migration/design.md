# Design

## Domain Model

Not applicable. This is a visual-system and component implementation change.

## Application Flow

Astro continues to statically render page routes and content. Existing client
interactions must continue through the framework path selected by the owner.

## Interface Contract

Public URLs, content, SEO metadata, keyboard behavior, and existing controls
remain compatible. Only their design-system implementation and appearance
change.

## Data Model

Not applicable. No content schema or persisted data changes are planned.

## UI / Platform Impact

- Current stack: Astro 6, Svelte 5, Tailwind CSS 4, shared shadcn-svelte UI.
- ReUI's official registry targets React 19. Its docs also define the Sera
  editorial style and extended tokens for info, success, warning, destructive,
  and inverse states.
- Confirmed path: keep Astro and Svelte, adopt ReUI's Sera visual direction,
  semantic color model, component states, and surface conventions through the
  existing CSS and Svelte primitives. Do not install React or official React
  components.

## Observability

No runtime telemetry changes are expected. Browser console and route checks
will verify the rendered result.

## Alternatives Considered

1. Integrate React into Astro and replace shared Svelte primitives with official
   ReUI components. Rejected because it expands this request into a framework
   migration.
2. Preserve Astro and Svelte and recreate ReUI's visual system in native
   Svelte/Astro components. Selected by the site owner.
