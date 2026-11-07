# SEO Round Two

## Status

in_progress

## Lane

normal

## Product Contract

A slow or unavailable `backend.ekel.dev` no longer fails the static build,
internal links point straight at the URLs that answer 200, and every indexable
page except generated tag archives carries a 140 to 160 character description.

## Relevant Product Docs

- `docs/product/website.md`
- `docs/stories/seo-audit-fixes.md`

## Acceptance Criteria

- `/wakatime` waits up to 30 seconds for each stats request at build time; if
  the backend still fails, the build succeeds and the page shows a warning
  Alert instead of stats.
- Internal links use the trailing-slash form, so no click or crawl hits the
  host's 308 redirect. Indexed URLs do not change. Navbar active state and
  `data-cy` selectors keep working.
- Static pages, notes, works, and experience detail pages have unique 140 to
  160 character descriptions that state only facts from the page.
- The owner approves the description drafts before they are committed.
- Works pages link stack items only to tag pages that exist; other stack items
  render as plain text.

## Design Notes

- Method: rankmyseo `seo-page-rewrite` rules for descriptions (length, one
  checkable detail, plain verbs, no invented facts). Indonesian notes keep
  Indonesian descriptions.
- Descriptions also render on cards in the homepage, notes, works, and tag
  lists, so visible list copy changes with them.
- Tag archives keep generated descriptions; 404 and 500 are noindex.
- The fallback follows the product contract's honest fallback pattern and the
  shared `@ikuyo/ui` Alert used by the market page.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable |
| Integration | Build passes with the real backend and with an unreachable backend; audit reports no slashless internal links and no out-of-range descriptions outside tags and error pages |
| E2E | Cypress specs covering SEO, collection lists, work details, and navbar state |
| Platform | Not applicable |
| Release | Live `/wakatime` and internal links after deploy |

## Harness Delta

None.

## Evidence

- Build with `BACKEND_API_URL=http://127.0.0.1:9`: exit 0, 93 pages, build log
  warns `[wakatime] stats unavailable at build`, and `/wakatime` renders the
  "Coding stats are unavailable" Alert.
- Build against `backend.ekel.dev`: exit 0, 93 pages, `/wakatime` renders
  `WakatimeStats`.
- Link check over the final build: 507 internal links, 0 slashless, 0 broken
  targets. Before: 571 slashless links, plus 26 stack-tag links to 404 pages
  such as `/tags/tailwind/` and `/tags/Go Fiber/`.
- Audit: descriptions outside 140 to 160 characters fell from 89 to 29, all
  generated tag archives or noindex error pages; 60 drafts written, each
  checked against its source content.
- `bun run lint:biome` passed (two existing CSS warnings, one info).
- Cypress against the dev server: seo 5/5, work-details 2/2,
  markdown-processing 3/3, theme 6/6, typography 3/3, guestbook 2/2, ihsg 2/2,
  github-contributions 7/7, collection-lists 7/8. The one failure expects the
  generated gtcd thumbnail, but the owner's uncommitted `works/gtcd.mdx` adds
  an ImageKit thumbnail. A guestbook row check flaked once near its 4s timeout
  and passed on rerun.
- Navbar is `client:only`; its active check still compares `item.path`
  without the slash, so only `href` changed.
