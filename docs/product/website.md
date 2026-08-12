# Website Product Contract

## Purpose

`ekel.dev` is Haikel Ilham Hakim's static personal website. It presents a biography, professional experience, selected work, technical notes, photography, and a small set of interactive public utilities.

## Primary surfaces

- Astro pages in `apps/web/src/pages` are static by default.
- MDX collections in `apps/web/src/content` own writing, work, and experience records.
- Svelte components are client islands only when interaction requires them.

## Experience contract

- Every homepage experience summary comes from the `experiences` collection.
- Every record has a unique URL at `/experiences/<slug>`.
- The homepage retains the company, role, date range, and highlights; the detail page renders the same facts plus editable MDX narrative.
- Undisclosed employers stay undisclosed in all public content.
- Experience pages are content pages, not notes: they do not render a reaction control or make backend requests.
