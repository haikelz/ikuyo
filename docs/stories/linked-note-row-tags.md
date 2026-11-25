# Linked note row tags

## Status

implemented

## Lane

normal

## Product Contract

Each tag on a note row opens its tag page, so readers can browse related notes from the homepage, `/notes`, and tag pages without opening the note first.

## Relevant Product Docs

- `docs/product/website.md`
- `DESIGN.md`

## Acceptance Criteria

- `NoteRow` renders every tag as a link to `/tags/<tag>/`, matching the existing note and work detail tag links.
- The homepage Latest Notes panel, `/notes`, and `/tags/<tag>` pick the links up through `NoteRow`; no page duplicates the markup.
- Tags keep their 12px muted style, gain the site's default link underline, and sit 12px apart so each stays a separate target under WCAG 2.2 target spacing.

## Design Notes

- UI surface: `apps/web/src/components/NoteRow.astro`.
- No new routes: `/tags/[...slug].astro` already builds a page for every note tag.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable; static markup |
| Integration | Astro check and production build |
| E2E | `cypress/e2e/collection-lists.cy.ts` "Note tags" checks every tag href on `/` and `/notes` and follows one |
| Platform | Note rows at 375px and 1280px without horizontal overflow |
| Release | Focused Biome and `git diff --check` |

## Harness Delta

`scripts/bin/harness-cli` is still missing from this checkout, so intake, proof, and trace rows were not recorded.

## Evidence

- `git diff --check`: passed.
- Not run: Biome, Astro check, build, Cypress, and the responsive browser check. Bun is not installed on the authoring machine.
