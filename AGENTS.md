# Ikuyo Agent Guide

This file is the bounded entrypoint for every agent session and every prompt.
Use the repository Harness for all work; do not bypass it because a request
looks small.

## Start every request here

1. Read the latest user request and classify it as **read-only** or **change**.
2. Read only the context required by `docs/CONTEXT_RULES.md`; preserve unrelated
   work shown by `git status --short`.
3. Keep one bounded outcome in scope. Prefer the smallest correct change and
   the repository's existing patterns.

### Read-only requests

Questions, explanations, reviews, diagnoses, plans, and status checks do not
authorize repository or Harness mutations.

1. Read this file and the exact files or evidence needed to answer.
2. Use inspection commands only.
3. Do not bootstrap Harness, record intake, update stories or backlog, or add a
   trace.
4. Stop once concrete repository evidence supports the answer.

### Change requests

Build, fix, rewrite, and other edit requests use this loop:

1. Read `docs/README.md`, `docs/FEATURE_INTAKE.md`, and the relevant product or
   story contract. Read `docs/ARCHITECTURE.md` for code or boundary changes.
2. Run `scripts/bootstrap-harness.sh` if local Harness state is not ready.
3. Record the request with `scripts/bin/harness-cli intake`, including its
   `tiny`, `normal`, or `high-risk` lane.
4. Check focused proof status with
   `scripts/bin/harness-cli query matrix --active --summary` and select one
   scoped story when the lane requires one.
5. Implement and validate inside that lane. Normal work needs a story packet;
   high-risk work needs the high-risk packet and applicable durable decisions.
6. Keep product contracts, story evidence, and proof records current when the
   change affects them.
7. Before the final response, inspect `git status --short`, review validation
   output, and record a trace following `docs/TRACE_SPEC.md`.
8. Fix Harness friction in scope or record it with
   `scripts/bin/harness-cli backlog add`.

`docs/HARNESS.md` is the full workflow authority. Do not change its source
hierarchy, risk policy, architecture direction, or validation requirements
without human confirmation.

## Repository map

- `apps/web`: static Astro 6 site with Svelte 5 islands and Tailwind CSS 4.
- `apps/web/src/pages`: file-based routes and static path composition.
- `apps/web/src/content.config.ts`: typed Astro collection schemas.
- `apps/web/src/content`: MDX records for notes, works, and experiences.
- `apps/web/src/components`: site-specific Astro and Svelte presentation.
- `packages/ui`: shared shadcn-svelte primitives; reuse these before adding UI.
- `docs/product`: current product contracts.
- `docs/stories`: bounded work packets and historical validation evidence.
- `docs/decisions`: durable architecture and product tradeoffs.
- `scripts/bin/harness-cli` and `harness.db`: versioned CLI and ignored local
  operational state for intake, stories, proof, traces, and backlog.

## Engineering rules

- Use Bun and Moon only; do not introduce npm, pnpm, or Yarn workflows.
- Preserve the Geist, monochrome, border-led system in `DESIGN.md`.
- Add public content through the typed collection in
  `apps/web/src/content.config.ts`; never duplicate collection records in page
  source.
- Keep routes static. Hydrate Svelte only for interaction that needs client
  state or browser APIs.
- Keep route composition in `pages`, shared presentation in `components`, and
  reusable primitives in `packages/ui`.
- Preserve semantic HTML, keyboard navigation, visible focus states, and
  reduced-motion behavior.
- Do not add a dependency when Astro, Svelte, the platform, or shared UI already
  covers the need.
- Never revert or overwrite unrelated work in the shared worktree.

## Validation

Scale proof to the change. The standard repository checks are:

```bash
bun run lint:biome
bun run --cwd apps/web build
bun run test:web
```

For UI changes, also inspect the built route at mobile, tablet, and desktop
widths. Record exact commands and outcomes in the active story and Harness trace
before calling change work complete. Never claim a check passed unless it ran.

<!-- AI-GUIDELINES:BEGIN -->
## AI Engineering Guidelines

Read `.agents/general.md` for every task. Then select the smallest matching context profile below. Do not read every installed companion by default. Repository-local contracts and instructions remain authoritative.

- **Repository setup, documentation, planning, or process:** no companion guideline.
- **JavaScript or TypeScript language/library work:** `.agents/guidelines/javascript-typescript.md` and `.agents/guidelines/haikel-javascript-typescript.md`.
- **Astro UI or application work:** `.agents/guidelines/javascript-typescript.md`, `.agents/guidelines/haikel-javascript-typescript.md`, and `.agents/guidelines/astro.md`.
- **Container, Compose, delivery, or runtime work:** `.agents/guidelines/docker.md`; add an application profile only when its build or runtime behavior also changes.
- **Cross-cutting work:** use the union of only the affected profiles and state why each additional document is needed.

### Workspace scopes

Match the changed path first, then use only that workspace's applicable profile.

- `.moon/cache/schemas/**`: javascript-typescript.
- `packages/ui/**`: javascript-typescript.
- `packages/typescript/**`: javascript-typescript.
- `packages/biome/**`: javascript-typescript.
- `apps/web/**`: javascript-typescript, astro, docker.
<!-- AI-GUIDELINES:END -->
