# GitHub Contribution Graph — Exec Plan

## Goal

Replace the homepage hero statement with Haikel's current GitHub contribution graph while preserving the static site architecture and editorial design system.

## Scope

In scope:

- A client-side contribution graph for `github.com/haikelz`.
- Validated loading, success, and unavailable states.
- Horizontal graph scrolling on narrow viewports without page-level overflow.
- Focused responsive and provider-boundary browser tests.

Out of scope:

- GitHub authentication, private contribution details, or repository data.
- A backend proxy, persisted cache, or build-time provider dependency.

## Risk Classification

Risk flags:

- External systems.
- Public contract.
- Cross-platform.
- Existing behavior.
- Weak proof.

Hard gates:

- External provider behavior.

## Work Phases

1. Verify the public contribution payload and homepage ownership boundary.
2. Record the runtime-fetch decision and deterministic test fixtures.
3. Implement the graph component and replace the hero statement.
4. Verify provider states, mobile scrolling, accessibility, and static build.
5. Record story proof and Harness trace.

## Stop Conditions

Pause for human confirmation if implementation would require a GitHub token, expose private contribution details, or introduce a backend service.
