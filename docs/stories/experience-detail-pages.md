# Experience Detail Pages

## Status

implemented

## Goal

Move the homepage's eight professional-experience records into an Astro MDX collection and make each record readable at `/experiences/<slug>`.

## Acceptance criteria

- The homepage is rendered from the collection and links every summary to a valid detail page.
- Each page has one `h1`, role, date range, highlights, MDX body, metadata, and standard article navigation.
- Every migrated record preserves the existing public company/role/date/highlight data.
- Detail pages are included in the generated OG-image map and static build output.
- Cypress proves homepage links and a representative page; Astro check, Biome, build, and the web E2E suite pass.

## Exclusions

- No `/experiences` index route or primary-navigation item.
- No reaction API integration or backend contract change.

## Evidence

- `bun run --cwd apps/web build`
- `cd apps/web && bunx start-server-and-test 'bun run dev' http://localhost:3000 'bunx cypress run --spec cypress/e2e/experiences.cy.ts --browser electron'`
- Browser QA at 375px, 768px, and 1280px; independent visual review passed.
