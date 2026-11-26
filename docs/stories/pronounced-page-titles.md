# Pronounced page titles

## Status

implemented, unvalidated

## Lane

normal

## Product Contract

The important page titles show their dictionary pronunciation in place of the
word, in the American respelling the owner's example uses (adjective:
/ˈajəktiv/). The word stays available to assistive technology, search, and a
hover tooltip. The homepage keeps its words.

## Relevant Product Docs

- `docs/product/website.md` (Page titles)
- `DESIGN.md` (Typography)

## Acceptance Criteria

- These page titles display their respellings: About `/əˈbout/`, Works
  `/wərks/`, Notes `/nōts/`, Tags `/taɡz/`, Guestbook `/ˈɡes(t)ˌbo͝ok/`, Tools
  `/to͞olz/`, Wakatime `/ˈwäkəˌtīm/`, Market Index `/ˈmärkət ˈinˌdeks/`.
- Each `h1`'s accessible name and text content still contain the word; the
  respelling is `aria-hidden` with the word as its `title`.
- The homepage, section titles (`h2`), error pages, tag archives, and detail
  pages keep their words.
- Lora renders the marks through its `latin-ext` subset.

## Design Notes

- UI surfaces: `PageHeader.astro`, the new `Pronounced.svelte` and
  `utils/pronunciation.ts`, and the Lora subsets in `astro.config.ts`.
- `PageHeader` renders `Pronounced` only for titles in the map, so dynamic
  titles (404, 500, `#tag`) pass through as words.
- Respellings follow Oxford Languages as Google shows them. Wakatime has no
  dictionary entry; its respelling follows "waka" as /ˈwäkə/ plus "time".
- The tie marks in o͝o and o͞o (U+035D, U+035E) are outside Lora's subsets and
  draw from the system serif.
- Owner follow-up: the first version converted section titles, the homepage
  included. The owner limited it to important titles and kept the homepage
  unchanged, so section titles went back to their words and page titles took
  the respelling.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable; static map and markup |
| Integration | `bun run lint:biome`; `bun run --cwd apps/web build` |
| E2E | `a11y.cy.ts` route semantics (one `h1` per page); `typography.cy.ts` heading size |
| Platform | `/about`, `/works`, `/notes`, `/tags`, `/guestbook`, `/tools`, `/wakatime`, `/ihsg` at 375px and 1280px: marks render, titles wrap cleanly |
| Release | `git diff --check` |

## Harness Delta

Bun and `scripts/bin/harness-cli` are still missing, so no intake, proof, or
trace rows were recorded.

## Evidence

- `git diff --check`: passed.
- Not run: Biome, Astro check, build, Cypress, and the browser check.
