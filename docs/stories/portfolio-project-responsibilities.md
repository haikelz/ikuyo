# Clarify responsibilities in AhsanXpress and SPMB project stories

## Status

implemented

## Lane

normal

## Product Contract

The AhsanXpress and SPMB Universitas Cakrawala work pages first explain what each project is, then present Haikel's contributions as clear, first-person responsibility lists grounded in the corresponding experience records.

## Relevant Product Docs

- `docs/product/website.md`
- `apps/web/src/content/experiences/pt-shidiq-membangun-indonesia.mdx`
- `apps/web/src/content/experiences/dibimbing.mdx`
- [AhsanXpress](https://ahsanxpress.id/)
- [Cakrawala University](https://www.cakrawala.ac.id/)

## Acceptance Criteria

- AhsanXpress responsibilities match the Shidiq experience record.
- SPMB responsibilities match the Dibimbing experience record.
- Each project overview comes before the responsibility list and explains the product's purpose.
- Neither page adds ownership or impact claims unsupported by those records.
- Both MDX entries remain valid Astro content and render in the Works detail routes.

## Design Notes

- UI surfaces: `/works/ahsanxpress` and `/works/spmb-universitas-cakrawala`.
- Keep copy in the typed Works collection; do not duplicate it in route source.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable; content-only change |
| Integration | Standalone Astro production build |
| E2E | Cypress checks for both Works detail responsibility lists |
| Platform | Not applicable |
| Release | Not applicable |

## Harness Delta

No harness changes required.

## Evidence

- `cd apps/web && bunx astro build` — passed; 94 static pages generated.
- `bunx cypress run --spec cypress/e2e/work-details.cy.ts --config baseUrl=http://127.0.0.1:3001` — passed, 2/2 detail pages.
- `bunx biome check cypress/e2e/work-details.cy.ts` — passed.
- `git diff --check` — passed.
- The standard `bun run --cwd apps/web build` is blocked by `astro check` rejecting installed TypeScript 7.0; standalone Astro build passed.
- Repository-wide Biome and the broader collection-list spec report unrelated pre-existing issues in other files and project-count assertions.
