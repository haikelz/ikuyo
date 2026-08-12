# Product Docs

This directory is the versioned product contract for the Ikuyo website. Keep
each user-visible domain in a small document instead of a monolithic spec.

## Current Product Contracts

`website.md` defines the current site surfaces and the experience-page content
contract.

## Update Rule

When behavior changes:

1. Update the affected product doc.
2. Update or create the story packet.
3. Update durable proof status with `scripts/bin/harness-cli story add` or
   `scripts/bin/harness-cli story update`.
4. Record a decision if the change affects architecture, scope, risk, or a
   previously settled product rule.
