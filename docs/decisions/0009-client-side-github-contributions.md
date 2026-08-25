# 0009 Client-Side GitHub Contributions

Date: 2026-08-25

## Status

Accepted

## Context

The static homepage needs a current contribution graph, but GitHub's official contribution calendar requires authenticated GraphQL access and the site must not fail to build when an external provider is unavailable.

## Decision

Fetch the public last-year contribution calendar from `github-contributions-api.jogruber.de` in a client-only Svelte island. Parse the unknown response before rendering, send no credentials, and provide explicit loading and unavailable states.

## Alternatives Considered

1. Fetch during Astro build: rejected because it couples deployment success to provider uptime.
2. Render a hosted SVG graph: rejected because its styling and semantics cannot fully match the local design system.
3. Add an authenticated backend proxy: rejected because it adds secrets and infrastructure for public data.

## Consequences

Positive:

- Static builds remain deterministic and provider-independent.
- The graph can match local tokens, responsive behavior, and accessibility semantics.

Tradeoffs:

- The graph appears after hydration and depends on a public third-party endpoint at runtime.
- Provider failure produces an unavailable state until a later page load.

## Follow-Up

- Replace the provider only if its reliability or response contract becomes unsuitable.
