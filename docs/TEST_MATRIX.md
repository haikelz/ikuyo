# Test Matrix

This file preserves the proof vocabulary and brownfield import shape used by
Harness consumers. The authoritative operational matrix is stored in SQLite
and queried with:

```bash
scripts/bin/harness-cli query matrix --active --summary
```

The upstream Harness repository has implemented behavior and executable proof.
An installed consumer starts without consumer-product rows and adds them only
when real work is accepted. Do not mark a row implemented until tests or other
validation evidence exist.

## Status Values

| Status | Meaning |
| --- | --- |
| planned | Accepted as intended behavior, not implemented |
| in_progress | Actively being built |
| implemented | Implemented and proof exists |
| changed | Contract changed after earlier implementation |
| retired | No longer part of the product contract |

## Matrix

| Surface | Behavior | Proof | Status |
| --- | --- | --- | --- |
| Content | Experience frontmatter validates and all detail routes build | `bun run --cwd apps/web build` | implemented |
| Browser | Homepage links each experience and a detail page renders facts | Cypress `experiences.cy.ts` | implemented |
| UI | Experience article preserves semantic page structure and responsive reading flow | Browser QA at 375px, 768px, and 1280px | implemented |

## Evidence Rules

- Unit proof covers pure domain and application rules.
- Integration proof covers backend enforcement, data integrity, provider
  behavior, jobs, or service contracts.
- E2E proof covers user-visible browser flows.
- Platform proof covers only shell, deployment, mobile, desktop, or runtime
  behavior that cannot be proven in lower layers.
- A story can be implemented without every proof column if the story packet
  explains why.
