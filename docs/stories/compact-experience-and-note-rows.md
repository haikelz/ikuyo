# Compact homepage experience and note rows

## Status

implemented

## Lane

normal

## Product Contract

Homepage experience rows show only company, role, dates, and the case-study link. Note and work rows on the homepage, `/notes`, and `/works` show a short one-line description.

## Relevant Product Docs

- `docs/product/website.md`
- `docs/stories/experience-detail-pages.md`

## Acceptance Criteria

- The homepage Experience panel no longer renders highlights. Each row keeps its company, role, date range, and the case-study link when `hasDetail` is not `false`.
- Experience detail pages still render every authored highlight and MDX narrative.
- Every note `description` is 90 characters or fewer and keeps the note's language.
- Every company and personal work `description` is 90 characters or fewer.

## Design Notes

- UI surface: `/` Experience panel; note rows through `NoteRow` and work rows through `WorkRow` on `/`, `/notes`, and `/works`.
- Domain rules: `highlights` stays required in the `experiences` schema because detail pages render it.
- Shorter descriptions also become the meta description for each note and work page, and the RSS and OG text for notes.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable; static content and route composition |
| Integration | Astro check and production build |
| E2E | `cypress/e2e/experiences.cy.ts` asserts homepage rows render no highlight list |
| Platform | Rendered homepage and `/notes` checked at 375px and 1280px |
| Release | Focused Biome and `git diff --check` |

## Harness Delta

`scripts/bin/harness-cli` is missing from this checkout, so intake, story proof, and trace rows were not recorded in `harness.db`.

## Evidence

- `git diff --check`: passed.
- All 19 note and 29 work frontmatter blocks parse as YAML with a non-empty `description` of 90 characters or fewer.
- Not run: Biome, Astro check, build, Cypress, and the responsive check. Bun is not installed on the authoring machine, so dependencies, including the `@ikuyo/biome/astro` config Biome extends, could not be installed.
