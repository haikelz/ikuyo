# Ikuyo Design System

## 1. Atmosphere & Identity

Ikuyo is a quiet, editorial personal site: content is the focal point and the signature is a restrained monochrome grid that gives long-form work a stable reading frame. Pages should feel precise and unhurried, with hierarchy created by type, spacing, and fine borders rather than decorative surfaces.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
| --- | --- | --- | --- | --- |
| Canvas | `--background` | `oklch(0.97 0 0)` | `oklch(0.175 0 0)` | Page background |
| Content | `--foreground` | `oklch(0.175 0 0)` | `oklch(0.97 0 0)` | Primary text |
| Muted surface | `--muted` | `oklch(0.96 0 0)` | `oklch(0.269 0 0)` | Subtle controls |
| Muted text | `--muted-foreground` | `oklch(0.45 0 0)` | `oklch(0.708 0 0)` | Metadata and secondary copy |
| Border | `--border` | `oklch(0 0 0 / 10%)` | `oklch(1 0 0 / 10%)` | Dividers and card outlines |
| Focus | `--ring` | `oklch(0.3 0 0)` | `oklch(0.556 0 0)` | Keyboard focus |

Use semantic Tailwind tokens (`background`, `foreground`, `muted-foreground`, `border`, `ring`) only. Accent color is reserved for an existing semantic component, not decoration.

## 3. Typography

- Primary: Geist Sans; mono: Geist Mono; Arabic display content: Noto Naskh Arabic.
- Display: `text-3xl` through `text-5xl`, bold, tight tracking.
- Section title: `text-2xl` through `text-3xl`, bold, tight tracking.
- Article title: `text-3xl` through `text-4xl`, medium, tight tracking.
- Body: `text-base` with `leading-7`; lead text may use `text-lg` or `text-xl`.
- Metadata and tags: `text-sm`, medium or regular, muted foreground.

## 4. Spacing & Layout

The spacing unit is 4px. Use existing Tailwind steps: 4/6/8 for local groups, 10/16 for page sections, and 24 top padding beneath the fixed navigation. The shell is a centered `max-w-6xl` container with 16px/24px/32px horizontal padding across base/sm/md breakpoints. Content collapses to one readable column on small screens.

Long-form article content is constrained to `max-w-3xl` inside the shell so desktop lines remain readable.

## 5. Components

### Content article

- **Structure:** back button, article header, metadata, optional tags/highlights, prose body, optional table of contents.
- **States:** text links visibly underline and brighten on hover; every interactive element retains the global focus ring.
- **Accessibility:** one `h1`, semantic `article`, descriptive back-button label, keyboard-accessible TOC.
- **Motion:** existing Astro view transition and entrance animation only; reduced-motion disables page-transition animation.

### Experience summary

- **Structure:** company link, date range, position, highlight list.
- **States:** company is an underlined text link with the site-standard hover/focus treatment.
- **Accessibility:** use an `h3` link and a semantic list for highlights; date remains plain text.

## 6. Motion & Interaction

Use the existing 300–400ms view transitions and transform/opacity entrance animation. Do not add decorative motion. All motion must respect `prefers-reduced-motion`; focus indicators must never be removed.

## 7. Depth & Surface

The strategy is borders-only. Fine low-contrast borders define cards, grids, and dividers; content surfaces remain transparent. Do not add shadows or gradients to the experience pages.

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- Target WCAG 2.2 AA: preserve semantic landmarks, one page `h1`, contrast-safe semantic colors, visible keyboard focus, and keyboard-reachable links/controls.
- Keep experience labels and dates legible without relying on color alone.
- Preserve the site's reduced-motion behavior.

### Accepted Debt

No new design debt is accepted for this change.
