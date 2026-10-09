# ReUI reading and portfolio patterns

## Status

Implemented and committed locally; not pushed or deployed.

## Lane

normal

## Product Contract

Adapt ReUI Scrollspy, Timeline, Alert, Code Block and Icon Tile to the existing Astro/Svelte portfolio, preserving content and navigation layouts without a React runtime or new dependencies.

## Relevant Product Docs

- `docs/product/website.md`
- `DESIGN.md`

## Acceptance Criteria

- Reading position highlights the corresponding heading in both ToC surfaces; mobile links dismiss the sheet.
- Experience timeline retains every authored highlight and link.
- Guestbook loading, empty, failure and stale data use semantic alerts; market statuses align with those variants.
- Copy includes full source, Wrap toggles soft wrapping, and snippets over 16 lines expand/collapse. Static highlighting and no-JavaScript readability remain.
- Tools retain their labels/links and use decorative outline tiles without hydration or mobile overflow.

## Design Notes

ReUI MCP APIs and worked examples consulted: `c-scrollspy-1`, `c-timeline-1`, `c-alert-1`, `c-code-block-1`, `c-icon-tile-1`. Keep native implementations at their current owners. Timeline remains static Astro markup; shared IconTile is a Svelte SSR primitive. Existing Alert already supports ReUI semantic variants.

## Validation

- Astro check: 0 errors/warnings, two pre-existing hints.
- Production build: 92 pages.
- Production Cypress: seven passing tests across markdown processing, guestbook and IHSG contracts.
- Scratch responsive checks: seven passing checks for timeline and seven tool icons at 1536/768/375px; guestbook loading/empty/error/stale and market loading/empty states.
- Final capture run: ten passing tests (three MDX plus seven scratch). Screenshots under `.amp/in/artifacts/reui-final/`; affected desktop/mobile states inspected. Electron capture window was enlarged to show the external desktop ToC rail; early captures clipped that rail.
- Impeccable detector: no findings in changed targets.
- Existing Biome nested-root configuration conflict remains out of scope.
