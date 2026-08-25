# Design

## Domain Model

A market refresh is usable when it contains at least one valid OHLC point. The
most recent usable dataset remains authoritative during transient provider
failure.

## Application Flow

`GetMarkets` fetches all configured markets concurrently. For each empty fresh
result, it substitutes a matching non-empty cached result. At least one fresh
dataset selects the normal cache TTL; an entirely failed refresh selects a
short retry TTL.

## Interface Contract

`GET /api/v1/ihsg/markets` retains its existing response envelope and market
DTO. A stale fallback preserves its original source and fetch timestamp so the
client does not misrepresent old data as freshly fetched.

## Data Model

No schema, migration, deletion, or retention change.

## UI / Platform Impact

The existing Svelte page can render the unchanged market DTO. Its availability
state remains useful before the backend has ever obtained valid data.

## Observability

Existing HTTP request tracing remains unchanged. Provider failures remain
visible through empty datasets when no last-known-good data exists.

## Alternatives Considered

1. Retry Yahoo immediately. This amplifies HTTP 429 rate limiting and still
   discards valid cached data.
2. Persist market data in the database. This adds a repository, migration, and
   lifecycle complexity that is not required to prevent refresh-time data loss.
3. Preserve the in-memory last-known-good result and use asymmetric TTLs. This
   is the smallest contract-preserving fix and is selected.
