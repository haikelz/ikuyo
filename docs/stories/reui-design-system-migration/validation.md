# Validation

## Proof Strategy

Verify the ReUI Sera design contract, all public page families, light and dark
themes, existing interactions, and responsive behavior in a real browser.
Confirm no React runtime or official React-only component source is introduced.

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit | Existing component checks, if present, remain green. |
| Integration | Astro production build and content/route generation. |
| E2E | Existing route, theme, navigation, and accessibility specs. |
| Platform | Browser at 375, 768, and 1280 CSS pixels; light and dark themes. |
| Performance | Compare production bundle and static output; avoid unnecessary hydration. |
| Logs/Audit | Browser console has no new errors; keyboard and focus behavior preserved. |

## Fixtures

Use existing public routes and the existing light/dark theme states.

## Commands

`bun run --cwd apps/web build`
`bun run lint:biome`
`bun run test:web`
`bun run dev:web` followed by real-browser route and interaction review.

## Acceptance Evidence

### Production and static output

- `bun run --cwd apps/web build` — passed; Astro reported 0 errors, warnings,
  or hints and generated all 92 routes.
- Changed app files passed the focused Biome check (24 files); changed shared UI
  files passed the focused Biome check (3 files).
- `bun run lint:biome` — still exits 1 on eight formatting findings in
  untouched files and one informational empty-export diagnostic in
  `apps/web/src/vite.d.ts`. `git diff --check` passes.

### Automated browser tests

- `bunx cypress run --spec 'cypress/e2e/collection-lists.cy.ts,cypress/e2e/theme.cy.ts,cypress/e2e/public-routes-responsive.cy.ts,cypress/e2e/github-contributions.cy.ts,cypress/e2e/ihsg.cy.ts'`
  — passed, 23/23 tests across five specs using a freshly started dev server.
- `bun run test:web` — 51/59 tests pass; four specs fail on existing test/app
  contract mismatches (theme-toggle accessible label, experience fixture/routes,
  and responsive-review case-study routes). Its IHSG dynamic-import failure
  does not reproduce against the clean server in the focused run above.

### Manual browser review

- `bash /Users/mac/.codex/skills/playwright/scripts/playwright_cli.sh open http://127.0.0.1:3000/design-system`
  — reviewed at 375, 768, and 1280 CSS pixels. Screenshots:
  `.playwright-cli/page-2026-09-27T03-56-51-585Z.png`,
  `.playwright-cli/page-2026-09-27T03-56-54-108Z.png`,
  `.playwright-cli/page-2026-09-27T03-56-56-665Z.png`.
- Also inspected `/works`, `/wakatime`, and `/ihsg`; mobile navigation and
  theme selection opened and worked. Theme automation covers light, dark, and
  system preference behavior.
- Browser console had no errors. Local GoatCounter emitted its expected
  localhost-not-counted warning.

### Scope confirmation

- Existing Astro/Svelte runtime, routes, interactions, and static output remain
  in place; no React dependency or React-only ReUI component was added.
- Harness story, product contract, design contract, and accepted decision all
  describe the owner-selected Svelte implementation of ReUI Sera.
