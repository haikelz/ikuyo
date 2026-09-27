# Charset Meta Head Order

## Status

implemented

## Lane

normal

## Product Contract

All pages rendered with the shared Astro layout declare UTF-8 as the first element in `<head>`, before title and other metadata, so browsers do not need to guess the document encoding.

## Relevant Product Docs

- `docs/product/website.md`

## Acceptance Criteria

- The charset declaration is the first element inside the shared document head.
- A browser regression check verifies the rendered homepage head ordering.
- The static site build succeeds.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable |
| Integration | Astro build output contains charset first in the head |
| E2E | Cypress SEO spec asserts the rendered head ordering |
| Platform | Not applicable |
| Release | Not applicable |

## Evidence

- Source inspection found `<title>` before `<meta charset>` in the shared layout.
- `astro build` completed under the repository-pinned Node 22 runtime.
- Built `dist/index.html` was checked and begins its `<head>` with `<meta charset>`.
- `bunx cypress run --project apps/web --spec apps/web/cypress/e2e/seo.cy.ts --config baseUrl=http://127.0.0.1:3000` passed all 3 tests.
- `bunx biome check cypress/e2e/seo.cy.ts` passed.
- Repository-wide `bun run lint:biome` remains red on unrelated existing formatting/lint findings; the changed Cypress spec passes its focused check.
