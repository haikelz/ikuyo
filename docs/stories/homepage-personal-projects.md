# Homepage company and personal project previews

## Status

implemented

## Lane

normal

## Product Contract

The homepage previews the first three company and personal projects in the same order as the complete Works page, with a path to each project and the full list.

## Relevant Product Docs

- `docs/product/website.md`
- `DESIGN.md`

## Acceptance Criteria

- The homepage presents separate Company Projects and Personal Projects sections with at most three collection-backed projects each.
- Both sections use the existing WorkRow presentation, thumbnails, project detail links, and a View all link to `/works`.
- `/works` continues to show all projects grouped by category.
- The new section is readable without horizontal overflow at mobile, tablet, and desktop widths.

## Design Notes

- UI surface: `/` inside the existing Layout Frame.
- The Works collection and its category/id ordering remain the source of truth; no new content records or client-side data fetching.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable; static route composition |
| Integration | Astro check and production build when available |
| E2E | Homepage project classification and links in the collection-lists Cypress spec |
| Platform | Rendered homepage inspected at 375px, 768px, and 1280px |
| Release | Focused Biome and `git diff --check` |

## Harness Delta

No Harness policy changes. Existing backlog #1 tracks guestbook API availability for local proof, #3 tracks the stale web validation baseline, and #5 tracks a local Sentry-upload opt-out.

## Evidence

- `bunx biome check src/pages/index.astro cypress/e2e/collection-lists.cy.ts` (from `apps/web`) and `git diff --check` — passed.
- `bun run lint:biome` — passed; it reported two pre-existing warnings and one info in untouched files.
- `bunx astro check` — passed with 0 errors, 0 warnings, and 2 hints in untouched files.
- `SENTRY_AUTH_TOKEN= SENTRY_PROJECT= SENTRY_ORG= bun run --cwd apps/web build` — passed, generating 92 pages. Sentry confirmed it did not create a release or upload source maps. The Harness story completion reran this proof successfully.
- `bunx cypress run --spec cypress/e2e/collection-lists.cy.ts` (from `apps/web`) — 6 passed, 2 failed. Both Project classification tests passed, including a click from the personal preview into its detail page; the failures are unrelated guestbook-row assertions at 375px and 1280px without a local guestbook API.
- Rendered homepage inspected at 375px, 768px, and 1280px in dark mode, plus 1280px in light mode. All six rows and thumbnails were visible without horizontal overflow; screenshots are under `.amp/in/artifacts/home-personal-*.png` and `.amp/in/artifacts/home-projects-*.png`.
- ReUI C1–C4 scans had no findings; the Impeccable detector returned `[]`.
