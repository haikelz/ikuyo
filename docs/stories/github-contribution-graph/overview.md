# GitHub Contribution Graph — Overview

## Current Behavior

The homepage hero leads with the statement “I Build Systems That Move Products and Businesses Forward.” It links to Haikel's GitHub profile but does not show contribution activity.

## Target Behavior

The statement is replaced by a design-system-aligned activity graph for `haikelz`. The graph loads after hydration, supports year selection, reveals a count-and-date tooltip when a day is hovered, supports horizontal scrolling at mobile widths, and degrades to an honest unavailable state when the provider fails or returns an invalid payload. The graph surface does not display a platform title or account username.

## Affected Users

- Portfolio visitors on desktop, tablet, and mobile browsers.
- Keyboard and screen-reader users consuming the homepage structure.

## Affected Product Docs

- `docs/product/website.md`
- `DESIGN.md`

## Non-Goals

- Reproducing GitHub profile navigation or account metadata.
- Showing repository names, private activity, streaks, or competitive metrics.
