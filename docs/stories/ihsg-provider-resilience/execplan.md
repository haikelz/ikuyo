# Exec Plan

## Goal

Keep the IHSG page populated through transient upstream provider failures.

## Scope

In scope:

- Preserve non-empty cached datasets when a refresh returns an empty market.
- Reduce successful refresh frequency and retry failed refreshes sooner.
- Add deterministic backend and frontend regression proof.

Out of scope:

- Provider replacement, persistence, deployment, or public API changes.

## Risk Classification

Risk flags:

- External systems.
- Public contracts.
- Existing behavior.
- Weak proof.

Hard gates:

- Deterministic provider-failure tests.
- Existing response schema must remain unchanged.

## Work Phases

1. Reproduce and inspect provider responses.
2. Define stale-on-error cache behavior.
3. Add regression tests.
4. Implement the bounded backend change.
5. Verify backend and frontend behavior.
6. Record Harness evidence and trace.

## Stop Conditions

Pause for human confirmation if the fix requires a new provider, API key,
database migration, public response change, or weaker validation.
