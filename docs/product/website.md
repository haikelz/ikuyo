# Website Product Contract

## Purpose

`ekel.dev` is Haikel Ilham Hakim's static personal website. It presents a biography, professional experience, selected work, technical notes, photography, and a small set of interactive public utilities.

## Primary surfaces

- Astro pages in `apps/web/src/pages` are static by default.
- MDX collections in `apps/web/src/content` own writing, work, and experience records.
- Svelte components are client islands only when interaction requires them.

## Homepage activity contract

- The homepage presents Haikel's public GitHub contribution calendar in place
  of the former hero statement.
- Contribution data loads after hydration so provider downtime cannot block a
  static build.
- The loading state mirrors the calendar and year control with a reduced-motion
  safe skeleton instead of shifting from a text placeholder.
- Unknown provider data is parsed before display, and unavailable data receives
  an honest fallback state.
- The calendar scrolls within its own region at narrow widths without causing
  page-level horizontal overflow.

## Experience contract

- Every homepage experience summary comes from the `experiences` collection.
- Every record has a unique URL at `/experiences/<slug>`.
- The homepage retains the company, role, date range, and highlights; the detail page renders the same facts plus editable MDX narrative.
- Undisclosed employers stay undisclosed in all public content.
- Experience pages are content pages, not notes: they do not render a reaction control or make backend requests.
