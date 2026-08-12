# Documentation Map

This directory holds the Ikuyo project harness and its versioned product truth.

## Main Files

- `HARNESS.md`: how humans and agents collaborate.
- `FEATURE_INTAKE.md`: how prompts become tiny, normal, or high-risk work.
- `ARCHITECTURE.md`: Astro, Svelte, MDX, and workspace boundary rules.
- `TEST_MATRIX.md`: legacy proof map; current proof status is queried with
  `scripts/bin/harness-cli query matrix`.
- `HARNESS_BACKLOG.md`: legacy improvement list; current improvement records
  are stored with `scripts/bin/harness-cli backlog`.
- `GLOSSARY.md`: shared terms.
- `contracts/`: versioned machine-readable contracts for optional external
  orchestrators.

## Folders

- `product/`: current product contracts for the personal site.
- `stories/`: feature packets and backlog.
- `decisions/`: durable decisions and tradeoffs.
- `demo/`: concrete walkthroughs that show how the harness transforms input
  into agent-ready work.
- `templates/`: reusable spec-intake, story, plan, decision, and validation
  formats.

## Current State

The upstream Harness v0 CLI is installed locally as `scripts/bin/harness-cli`.
The consumer project is the Bun/Moon Astro workspace described in
`product/website.md`; its checks are recorded in `TEST_MATRIX.md`.
