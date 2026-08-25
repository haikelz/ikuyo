# Validation

## Proof Strategy

Use a deterministic local Yahoo-compatible HTTP server to prove initial
success, cache expiry, provider failure, stale fallback, and the failed-refresh
retry TTL. Retain focused browser tests for frontend success and unavailable
states, then run repository checks proportionate to the touched files.

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit | Preserve each cached market when the next provider refresh fails; select success and retry TTLs |
| Integration | Existing IHSG handler and response DTO compile with the use case |
| E2E | Render an available fallback market; distinguish provider unavailability from request failure |
| Platform | Existing IHSG responsive route proof at mobile, tablet, and desktop |
| Performance | Successful data refreshes occur less frequently than before |
| Logs/Audit | Not applicable; no user or security event changes |

## Fixtures

- Local Yahoo-compatible success payload with OHLCV data.
- Local provider HTTP 429 response.
- Cypress intercepted market envelopes.

## Commands

```text
go test ./...
bunx cypress run --spec cypress/e2e/ihsg.cy.ts
bun run lint:biome
bun run --cwd apps/web build
```

## Acceptance Evidence

- Live diagnosis on 2026-08-25 reproduced Yahoo Finance HTTP 429 responses for
  all five symbols and Stooq HTTP 200 browser-verification HTML instead of CSV.
  The deployed endpoint alternated between a 256 KB-plus successful payload
  and an all-empty 1,150-byte payload after cache expiry, confirming that a
  failed refresh replaced valid cached data.
- `go test -race ./...` in `../ekel-backend`: passed, including deterministic
  successful-refresh, HTTP 429, stale-fallback, market-isolation, and TTL proof.
- `bunx astro check`: passed with 0 errors, warnings, or hints.
- `bun run build`: passed and generated 91 static pages.
- Production-preview Cypress `ihsg.cy.ts`: 2 tests passed, covering fallback to
  an available market and the all-unavailable provider state.
- Production-preview Cypress `public-routes-responsive.cy.ts`: 3 tests passed
  at mobile, tablet, and desktop widths without horizontal overflow.
- Focused Biome check for `IHSGChart.svelte` and `ihsg.cy.ts`: passed.
- Repository-wide `bun run lint:biome` remains red on 11 pre-existing findings
  in `vite.d.ts`, `astro.config.ts`, `Navbar.svelte`, reaction/Wakatime
  components, and CSS import ordering; no finding is in an IHSG changed file.
- The long-running development server had stale Vite module state and could not
  dynamically import `IHSGChart.svelte`; the clean production build and preview
  loaded the island and passed all focused browser proof.
