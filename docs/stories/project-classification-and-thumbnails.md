# Classify company and personal projects with thumbnails

## Status

implemented

## Lane

normal

## Product Contract

Work records are categorized as company or personal projects. The homepage
features company projects, while `/works` shows both categories in order and
each card includes an image.

## Relevant Product Docs

- `docs/product/website.md`
- `DESIGN.md`

## Acceptance Criteria

- Add AhsanXpress and SPMB Universitas Cakrawala narratives grounded in the
  existing Shidiq Membangun Indonesia and Dibimbing experience content.
- Add Catatpro, KelolaSurat, and Shidiq Membangun Indonesia Landing Page with
  editable lorem ipsum content.
- Existing works default to personal; `/works` groups company projects first.
- The homepage shows company projects only, and every project card uses a
  supplied image or generated thumbnail containing the project name.
- All cards remain responsive without horizontal overflow.

## Design Notes

- UI surfaces: homepage project list and `/works` collection page.
- Keep the current bordered editorial row pattern, adding a compact thumbnail.
- Generated title images use the existing `/og/works/<slug>.png` route.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable; content and rendering change |
| Integration | Astro production build and schema validation |
| E2E | Collection and responsive Cypress scenarios |
| Platform | Browser screenshots at mobile, tablet, desktop |
| Release | Not applicable |

## Harness Delta

No harness changes required.

## Evidence

| Check | Command or artifact | Outcome |
| --- | --- | --- |
| Astro production output | `bunx astro build` from `apps/web` | Passed; generated 97 static pages including all five project and OG routes. |
| Collection and responsive browser tests | `cd apps/web && bunx cypress run --spec cypress/e2e/collection-lists.cy.ts,cypress/e2e/responsive-review.cy.ts --config baseUrl=http://127.0.0.1:3001` | Passed, 16/16 against the production preview. |
| Biome | `bunx biome check 'src/pages/og/[...route].ts' cypress/e2e/collection-lists.cy.ts cypress/e2e/responsive-review.cy.ts src/content.config.ts src/pages/index.astro src/pages/works/index.astro src/components/WorkRow.astro` from `apps/web` | Passed. |
| Responsive visual QA | `output/playwright/project-classification/{home,works}-{375,768,1280,1536}.png` | Captured at mobile, tablet, desktop, and wide desktop widths. |
| Project-section visual QA | `output/playwright/project-classification/home-company-{375,1280}.png`, `works-personal-{375,1280}.png` | Captured after scrolling to Company Projects and Personal Projects; title-first generated thumbnails are legible at row size. |
| Repository build script | `bun run build` | Blocked at `astro check`: installed TypeScript 7 is unsupported by Astro's checker. `bunx astro build` succeeds; dependency files were pre-existing user changes and were left untouched. |

The project-page assertion confirms the generated fallback thumbnail is
`/og/works/ahsanxpress.png`; the works OG renderer now makes titles the primary
image content so generated thumbnails remain legible at row size. The stale
Puasa Sunnah API thumbnail URL was confirmed as HTTP 404 and removed so this
existing project also uses its generated title thumbnail.
