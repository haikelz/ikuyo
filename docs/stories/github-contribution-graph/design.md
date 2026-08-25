# GitHub Contribution Graph — Design

## Domain Model

A contribution day has an ISO date, a non-negative contribution count, and a level from 0 through 4. The graph filters the provider's all-years sequence by the selected year and groups days into Sunday-first weeks for display.

## Application Flow

1. The static homepage renders the hero and a client-only Svelte island.
2. On mount, the island requests the public all-years contribution payload for `haikelz`.
3. A boundary parser rejects malformed year totals, dates, counts, levels, or contribution arrays.
4. Valid days render as a 7-row calendar filtered by the selected year; failed parsing or transport renders an unavailable state.

## Interface Contract

- Provider: `GET https://github-contributions-api.jogruber.de/v4/{username}?y=all`.
- Required response fields: year-keyed `total` values and `contributions[]` containing `date`, `count`, and `level`.
- No credentials, cookies, writes, or private GitHub data are sent.

## Data Model

No persisted data, migration, or retention behavior is introduced.

## UI / Platform Impact

The graph uses square, border-led, monochrome surfaces and mono metadata without a visible platform title or username. A shared design-system Select aligns with the `Product/Devops` eyebrow above the graph. The calendar keeps a fixed readable width inside an `overflow-x-auto` region; the page itself must not overflow at 375px, 768px, or 1280px.

## Observability

The component exposes a polite loading status and visible unavailable state. No provider payload is logged.

## Alternatives Considered

1. Build-time fetch was rejected because provider downtime would make the static deployment fail.
2. A third-party SVG image was rejected because it prevents complete design-system styling and meaningful cell semantics.
3. A backend proxy was rejected as unnecessary infrastructure for public read-only data.
