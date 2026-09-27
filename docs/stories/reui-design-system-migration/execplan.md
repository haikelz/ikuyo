# Exec Plan

## Goal

Adopt ReUI across Ikuyo's visual system and shared components without losing
the static-site behavior, existing interactions, accessibility, or responsive
support.

## Scope

In scope:

- Replace the current design contract, semantic tokens, and shared component
  styling across `apps/web` and `packages/ui`.
- Update public pages to use the selected system consistently.
- Preserve all routes, content, theme behavior, interactions, and accessibility.
- Validate representative and public routes at mobile, tablet, and desktop.

Out of scope:

- Content rewrites, new product behavior, route changes, backend changes, and
  deployment changes.
- Installing paid ReUI blocks, icons, or templates unless separately requested.

## Risk Classification

Risk flags:

- Existing behavior: shared presentation and interactions change site-wide.
- Public contract: every public route receives a visual change.
- Cross-platform: responsive browser layouts and theme modes must remain sound.
- Weak proof: current coverage does not exercise every visual primitive/state.
- Multi-domain: shared components and all public page families are in scope.

Hard gates:

- The site owner selected the Astro/Svelte implementation path on 2026-09-27.
- Do not add React or official React-only ReUI components under this decision.

## Work Phases

1. Record the confirmed path and Sera styling choice in durable docs.
2. Extract ReUI's semantic tokens and component conventions into `DESIGN.md`.
3. Implement shared tokens and migrate primitives and public page families.
4. Run existing checks and real-browser responsive and interaction QA.
5. Update product documentation, story proof, and Harness trace.

## Stop Conditions

Pause for human confirmation if implementation requires moving the app or
shared UI to React, adding a new runtime, or changing the confirmed delivery
architecture.
