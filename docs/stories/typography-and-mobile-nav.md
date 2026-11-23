# Typography and Mobile Navigation

## Status

implemented

## Lane

normal

## Product Contract

ekel.dev's typography uses Lora titles over Inter body text, a 16px body,
and a calmer article style. On phones the navigation
collapses into a menu button that opens a sheet of links.

## Relevant Product Docs

- `DESIGN.md` (Atmosphere, Typography, Panel, Navigation bar)
- `docs/product/website.md` (Navigation)

## Acceptance Criteria

- Inter loads as a variable font (100 to 900, normal and italic) and Lora as a
  variable font (400 to 700, normal); no weight the site uses is synthesized.
- Body text is 16px with 1.5 line-height; page titles are 24px, then 30px from
  768px, in Lora.
- Panel titles, page titles, and dialog titles set in Lora; row titles stay in
  Inter at 16px; secondary text is 14px and tertiary text 12px.
- Article prose keeps 16px and 1.75 line-height, sets headings in Lora, and
  stops text lines at 65ch while code blocks keep the column.
- Below 640px the bar shows the owner's name, the theme toggle, and an "Open
  menu" button; the sheet lists every link with the current page marked,
  closes with Escape, and returns focus to the button.
- From 640px the link row shows as before and the menu button is hidden.

## Design Notes

- Style: headings in Lora at weight 500 with balanced wrapping, body text in
  Inter at 16px, and articles with Lora semibold headings on an em scale,
  1.75 leading, and links that keep the text color with a 30% underline.
- The site previously loaded only weight 400 of Plus Jakarta Sans, so every
  medium and semibold weight was synthesized.
- The base heading rule covers `h1`, `h2`, and `role="heading"` at levels 1 and
  2, because bits-ui renders dialog and sheet titles as headings on `div`.
- Row titles stay in Inter, so list entries read as sans links under serif
  section titles.
- The 48rem column from the guestbook system stays; capping prose lines at
  65ch brings article lines near 78 characters at desktop widths.
- The phone bar's name link ("Haikel") follows the site's title suffix. The
  menu reuses the shared `Sheet` primitive from the top edge; the sideways
  scrolling link strip and its centering code are gone.
- OG images still render with Plus Jakarta Sans from `@fontsource`.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable |
| Integration | `astro check` and lint pass |
| E2E | Full Cypress suite; failures limited to ones that predate this story |
| Platform | Screenshots at 375 and 1280px in light and dark modes |
| Release | Live pages after deploy |

## Harness Delta

The local Harness CLI and `harness.db` are still missing from this checkout,
so no intake row or trace was recorded.

## Evidence

- New `navigation.cy.ts`: the phone menu lists 7 links with Notes marked
  current, Escape closes it and returns focus to the button, and a link
  navigates; at 640px the link row shows and the menu button hides.
- `typography.cy.ts` now asserts Inter on the root, Lora on `h1`, a 16px body
  with 24px line-height, 24px and 30px titles, and 16px prose with 28px
  line-height.
- Full `bunx cypress run` against the dev server: typography 3/3, navigation
  2/2, theme 6/6, markdown-processing 3/3, guestbook 2/2, seo 5/5,
  work-details 2/2, ihsg 2/2, github-contributions 2/2 (6 pending).
- Failures that predate this story, same tests as before: a11y 6 (removed
  routes, `/photos` without ImageKit secrets, the stale theme button check),
  experiences 4, responsive-review 7, public-routes-responsive 3,
  view-transitions 1 (needs a production build). collection-lists fails its 2
  guestbook cases because the local dev server points at a placeholder backend
  URL; the stubbed guestbook spec passes.
- Screenshots: home (375 light, 1280 light and dark), notes list, a note
  article (375 light, 1280 dark), about (375 dark), tools, works (375), and the
  open menu in both modes.

## Revision: relaxed leading and justified descriptions

- Owner feedback: the type felt tight; descriptions should justify.
- Body line-height rises to 1.625; reading text (intros, bios, descriptions,
  row summaries, prose) uses a `--leading-reading` token of 1.8.
- Descriptions, intros, and bios justify from `sm` with `hyphens-auto` and
  normal wrapping; phones keep left alignment and `text-pretty`. Pretty
  wrapping had shortened lines that justify then stretched.
- The phone bar shows the owner's GitHub avatar instead of the name; the
  footer stacks and centers below 640px.
- The About bio now says the owner is experienced in edtech and logistics
  instead of listing courier and SaaS work.
- Validation: screenshots of home (375 and 1280), notes (1280 dark), and a
  note (1280) after the leading change; `typography.cy.ts` passed with a 26px
  body and 28.8px prose line-height before the hyphenation and bio edits. The
  owner asked to skip further test runs, so the footer, hyphenation, and bio
  edits were checked in served HTML only.

## Revision: typography audit of every route

- Method: a standalone puppeteer script (outside the repo) recorded the
  rendered family, size, weight, leading, tracking, alignment, characters per
  line, contrast, and face coverage of every visible text node on 17 routes at
  375 and 1280px, plus full-page screenshots.
- Fixed, high: works, notes, and experience detail pages rendered
  `ReadingIndicator` before `<Layout>`, pushing `<meta charset>` past byte
  1024; without a charset header, titles, apostrophes, and the Arabic
  bismillah decoded as mojibake. The indicator now renders inside the layout.
- Fixed, medium: Noto Naskh Arabic loaded only weight 400 while the bismillah
  (700) and Eid text (500) were synthesized; `.arabic-font` and the Eid inline
  style named the family without Astro's hashed name, so Arabic never used the
  web font; the Eid Arabic line had letter-spacing that breaks joins.
- Fixed, medium: article lines ran to 86 characters because `65ch` of Inter
  is about 84 characters; prose now stops at 36rem and 14px row text at 60ch.
  After the fix, 16px multi-line text measures a median of 61 and a maximum of
  78 characters per line.
- Fixed, low: wrapped 12px tag and stack lines get relaxed leading; detail
  metadata uses middle dots, day-month-year dates, and an en dash for ranges.
- Open: muted text inside destructive and warning alerts measures 4.39:1
  against the alert fill, under the 4.5:1 AA floor; that is a color-token
  change and is left for the owner.

## Revision: homepage reading pass

- Owner feedback: the homepage still read badly after the audit.
- Justified text in the 30rem to 36rem columns opened wide word gaps in the
  intro and left one word alone on the last line of row descriptions
  ("ups.", "me.", "orang."), so this pass left-aligned them. The owner then
  asked for every description justified on every page; see the next
  revision.
- Experience highlights used 1.8 leading with a 6px gap, so lines inside a
  bullet sat almost as far apart as the bullets. 14px row text now uses
  `leading-relaxed` (1.625) and highlights sit 8px apart.
- Highlights rendered in full-strength ink, louder than the muted intro above
  them; they are muted now like the other row summaries. Note dates gained
  `tabular-nums`.
- Validation: 2x crops of the intro, Experience, Company Projects, and Latest
  Notes at 375 and 1280px in light mode and 1280px dark, before and after.
  No Cypress run, per the owner.

## Revision: justify every description

- Owner request: every description justifies, on every page.
- Page header descriptions (every list, tag, error, and utility page), the
  homepage intro, the About bio, Notes, Works, and Tools row descriptions,
  and Experience highlights on the homepage and detail pages use
  `text-justify hyphens-auto` at every width. `text-pretty` came off those
  elements because it shortens lines that justify then stretches.
- Titles, metadata, guestbook messages, and article prose stay left-aligned.
- Owner question: why the descriptions did not fill the width. The audit's
  60ch and `max-w-xl` caps left a blank strip beside the justified edge; the
  caps are gone from every description.
- Works rows on phones put the thumbnail beside the title only, so the
  description runs at the full 309px row width instead of about 210px.
- Validation: screenshots at 375 and 1280px of home, about, notes, works,
  tools, an experience page, and a tag page, plus a script that measures the
  widest justified space. At 1280px the widest space is 0.65em or less on
  every route (a normal space is about 0.28em). At 375px a few lines still
  stretch to 1.3 to 2em where the next word cannot hyphenate (for example
  "WordPress"). No Cypress run, per the owner.

## Revision: full-width justified articles

- Owner request: Works and Notes detail pages fill the column and justify.
- `prose.css` drops the 36rem cap on paragraphs, lists, quotes, and headings;
  paragraphs and list items justify with `hyphens: auto` and lose
  `text-wrap: pretty`. Experience pages drop `prose-p:text-pretty` for the
  same reason. Headings and code stay left-aligned.
- Validation: screenshots of `/notes/k8s/` and
  `/works/spmb-universitas-cakrawala/` at 375 and 1280px. Widest justified
  space at 1280px: 0.36em on k8s, 0.48em on SPMB, 0.88em on the Indonesian
  zsh-to-fish note (English hyphenation rules). No Cypress run, per the owner.
