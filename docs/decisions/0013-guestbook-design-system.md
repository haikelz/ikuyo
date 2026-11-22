# Adopt the guestbook design system on the existing Astro and Svelte stack

Date: 2026-11-23

## Status

Accepted. Supersedes `0012-reui-visual-system-on-svelte.md`.

## Context

The owner asked for ekel.dev to take the design system of
`guestbook.ekel.dev` and replace the ReUI Sera system. The guestbook is a
Next.js app on HeroUI v3 and React Aria, with its own `--gb-*` palette layered
over HeroUI's defaults. Ikuyo is Astro and Svelte with shadcn-svelte
primitives in `@ikuyo/ui`, all driven by semantic CSS tokens.

## Decision

Keep Astro and Svelte. Port the guestbook's tokens (palette, 10px radius,
panel shadow), type scale (Tailwind defaults, 14px interface text), layout
(48rem column, full-width footer), and patterns (bordered list panels with a
heading row, count pills, divided rows, 2px accent focus outline) into the
existing theme CSS, `@ikuyo/ui` primitives, and Astro components. Map the
`--gb-*` values onto the shadcn token names the primitives already read.

## Alternatives Considered

1. Add `@heroui/styles` and rebuild components on HeroUI's CSS classes. Its
   token names clash with shadcn's (`--accent` means the brand color in HeroUI
   and the hover fill in shadcn), and every primitive would need rewriting.
2. Add React and HeroUI's React components. Ships a second framework runtime
   for a static site.
3. Port the values and patterns into the existing token layer and components.
   Selected.

## Consequences

Positive:

- One token swap restyles every shared primitive; pages changed only where the
  guestbook's structure differs (panels, header, footer, no page frame).
- No new dependency or runtime.

Tradeoffs:

- The ReUI Frame shell and the homepage timeline are gone; the `Frame`
  primitive was deleted with its last caller.
- Body text drops from 17px to 14px, matching the guestbook; long-form prose
  keeps 16px.
- HeroUI updates to the guestbook do not flow into Ikuyo automatically.

## Follow-Up

- `DESIGN.md` is the contract; keep it in step with the guestbook if that site
  changes its tokens.
