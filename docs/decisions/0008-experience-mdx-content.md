# 0008: Store experience entries as MDX content

## Status

Accepted

## Context

Experience data was an inline array in the homepage, which made a detail route and longer narrative impossible without duplicating facts.

## Decision

Use an Astro `experiences` collection. Frontmatter owns homepage facts (`company`, `position`, date labels, sort order, description, and highlights); each MDX body owns the expandable narrative. The homepage and the static experience route both read this collection.

## Consequences

The content schema validates all public experience records at build time. New experiences require one MDX file, rather than a page-source edit. No backend endpoint is needed.
