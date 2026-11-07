# SEO Audit Fixes

## Status

implemented

## Lane

normal

## Product Contract

Crawlers reach the real sitemap, every indexable page names its served URL as
canonical, structured data claims only what the page states, and each tag
archive describes its own notes.

## Relevant Product Docs

- `docs/product/website.md`
- `docs/stories/editorial-portfolio-and-seo.md`

## Acceptance Criteria

- `robots.txt` and the shared Layout point to `/sitemap-index.xml`, the file
  `@astrojs/sitemap` generates; `/sitemap.xml` returned 404 in production.
- Indexable pages use the trailing-slash URL as canonical, `og:url`, and
  JSON-LD `@id`, matching the sitemap and the URL that answers 200.
- Pages typed `article` emit `Article` JSON-LD only with a publish date;
  works and experiences fall back to `WebPage`.
- Each tag archive has a unique description built from its notes.
- `/tools` headings follow h1 then h2.
- Titles skip the name suffix when it would pass 60 characters.

## Design Notes

- Audit method: rankmyseo `seo-site-setup` on-page checklist and
  `seo-existing-site` inventory, run as a stdlib script over the built `dist`
  plus live `curl` checks. RankMySEO and Search Console data were not
  connected, so no traffic or rank data informed the decisions.
- AI crawler rules stay as set by the Cloudflare managed `robots.txt`
  (`search=yes`, `ai-train=no`).
- Out of scope pending owner decisions: description rewrites, note language
  tagging, internal link URL form, thin tag pages, `llms.txt`, and
  server-rendered WakaTime stats.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable |
| Integration | Audit script over the built `dist` reports the fixed findings gone |
| E2E | Cypress SEO spec covers canonical form, sitemap pointers, and manifest |
| Platform | Not applicable |
| Release | Live `robots.txt` and canonical checks after deploy |

## Harness Delta

None.

## Evidence

- Live before: `robots.txt` and the Layout pointed to
  `https://ekel.dev/sitemap.xml` (404); `/notes` answered 308 to `/notes/`
  while canonicals used `/notes`.
- Audit over 93 built pages, before then after: canonical mismatches 90 to 0,
  `Article` without `datePublished` 32 to 0, duplicate tag descriptions 29 to
  0, skipped heading levels 1 to 0, titles over 60 characters 3 to 1 (the
  remaining note title is 64 characters on its own).
- Built `robots.txt` now lists `Sitemap: https://ekel.dev/sitemap-index.xml`,
  and that file exists in `dist`.
- `/tools` headings sit outside any `.prose` wrapper, so the h2 tags render
  like the former h3 tags; no responsive screenshots needed.
- `bun run lint:biome` passed (two existing CSS warnings, one info).
- `bun run --cwd apps/web build` passed: `astro check` 0 errors, 93 pages.
- `bunx cypress run --spec cypress/e2e/seo.cy.ts` passed 5 of 5.
- `harness-cli story verify seo-audit-fixes` failed only because
  `backend.ekel.dev` answered 503 while `/wakatime` prerendered (backlog #9).
