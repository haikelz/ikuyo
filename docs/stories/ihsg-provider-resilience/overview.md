# IHSG Provider Resilience

## Current Behavior

The backend refreshes five daily market datasets every five minutes. A transient
failure from Yahoo Finance or Stooq produces empty datasets and replaces the
previously valid in-memory cache, so the IHSG page has no chart data until a
later refresh succeeds.

## Target Behavior

The backend keeps serving each market's last valid dataset when an upstream
refresh fails. Failed refreshes retry sooner, while successful refreshes are
cached longer to reduce provider rate-limit pressure. The response envelope and
frontend market contract remain unchanged.

## Affected Users

- Visitors reading the public IHSG market page.

## Affected Product Docs

- `docs/product/website.md`

## Non-Goals

- Replacing the market-data providers.
- Adding intraday quotes or changing the public response schema.
- Deploying either repository.
