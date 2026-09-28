# Ikuyo Design System

## 1. Atmosphere & Identity

Ikuyo uses ReUI's Sera direction: editorial, typographic, and composed around
content. The interface pairs a calm neutral canvas with a focused indigo accent,
softly rounded surfaces, fine borders, and clear semantic status colors. The
system is implemented with Astro, Svelte, and Tailwind CSS; it adopts ReUI's
documented design language without importing React-only registry components.

## 2. Color

Use semantic tokens for all interface colors. Status colors communicate
information consistently and never carry meaning alone.

| Role        | Token                | Light                    | Dark                       | Usage                       |
| ----------- | -------------------- | ------------------------ | -------------------------- | --------------------------- |
| Canvas      | `--background`       | `oklch(0.985 0.004 275)` | `oklch(0.17 0.018 275)`    | Page background             |
| Content     | `--foreground`       | `oklch(0.205 0.018 275)` | `oklch(0.96 0.008 275)`    | Primary text                |
| Card        | `--card`             | `oklch(1 0 0)`           | `oklch(0.215 0.018 275)`   | Raised content surfaces     |
| Primary     | `--primary`          | `oklch(0.47 0.17 278)`   | `oklch(0.76 0.13 278)`     | Main actions and links      |
| Muted       | `--muted`            | `oklch(0.96 0.008 275)`  | `oklch(0.26 0.018 275)`    | Quiet surface               |
| Muted text  | `--muted-foreground` | `oklch(0.48 0.018 275)`  | `oklch(0.7 0.018 275)`     | Metadata and secondary copy |
| Border      | `--border`           | `oklch(0.9 0.01 275)`    | `oklch(1 0.008 275 / 11%)` | Surface and row boundaries  |
| Focus       | `--ring`             | `oklch(0.55 0.16 278)`   | `oklch(0.68 0.12 278)`     | Keyboard focus              |
| Info        | `--info`             | `oklch(0.92 0.04 278)`   | `oklch(0.29 0.07 278)`     | Informational state         |
| Success     | `--success`          | `oklch(0.92 0.05 155)`   | `oklch(0.29 0.07 155)`     | Positive state and gains    |
| Warning     | `--warning`          | `oklch(0.94 0.06 83)`    | `oklch(0.32 0.07 83)`      | Caution state               |
| Destructive | `--destructive`      | `oklch(0.54 0.2 27)`     | `oklch(0.65 0.18 27)`      | Errors and losses           |
| Invert      | `--invert`           | `oklch(0.22 0.018 275)`  | `oklch(0.96 0.008 275)`    | Inverse emphasis            |

Use the corresponding `*-foreground` tokens for text on semantic surfaces.
Positive and negative market movement uses `--success` and
`--destructive`. Avoid raw palette colors in page and component markup.
Categorical data series use `--chart-1` through `--chart-10` so visualizations
stay theme-aware without implying status.

## 3. Typography

- Primary: Geist Sans; mono: Geist Mono; Arabic display content: Noto Naskh Arabic.
- Display: `text-4xl` through `text-6xl`, semibold or bold, tight tracking.
- Page title: `text-3xl` through `text-5xl`, semibold, tight tracking.
- Section title: `text-xl` through `text-3xl`, semibold.
- Body: `text-base` with `leading-7`; lead text may use `text-lg` or `text-xl`.
- Metadata and tags: `text-xs` or `text-sm`, medium, muted foreground.
- Use mono for dates, indexes, code, and compact technical labels only.

## 4. Spacing & Layout

Use Tailwind's 4px spacing scale. Keep related controls compact with 2–4 spacing
steps; separate content sections by 10–16 steps. The centered site shell uses
`max-w-3xl` with 4/6/8 horizontal padding across base/sm/md breakpoints.
Editorial rows and media grids adapt to a single readable column on small
screens. Notes and Works detail pages use the full `max-w-3xl` shell; other
long-form prose may retain a `max-w-3xl` reading measure.

## 5. Components

### Page header

- **Structure:** eyebrow, one page title, optional concise introduction.
- **States:** accent eyebrow; links use primary foreground and visible hover/focus.
- **Accessibility:** preserve heading order and keep the description readable.

### Card and content surface

- **Structure:** semantic card with a clear title, optional description, content,
  and actions.
- **States:** card surface, foreground, and border use semantic tokens; hover
  elevation appears only when the whole surface is interactive.
- **Accessibility:** interactive cards contain a real link or button and retain
  a visible focus ring.

### Button and link

- **Variants:** primary for the main action, secondary for supporting actions,
  outline for low-emphasis controls, and destructive for irreversible actions.
- **States:** consistent hover, active, disabled, and focus-visible treatments.
- **Accessibility:** use native controls, descriptive labels, and keyboard focus.

### Status, alert, and badge

- Use info, success, warning, destructive, and invert semantic token pairs.
- Keep icon, label, and color cues together so status is not color-only.

### Fields, dialogs, and sheets

- Fields use input, border, muted, destructive, and ring tokens.
- Dialogs and sheets use popover surfaces, a visible boundary, and focus
  management supplied by the existing Svelte primitives.

### Editorial row

- **Structure:** leading metadata, central content, optional trailing action.
- **States:** quiet borders divide rows; linked titles use the primary accent.
- **Accessibility:** retain semantic lists, headings, and descriptive links.

### Table of contents

- **Structure:** Notes and Works detail pages fill the `max-w-3xl` site shell.
  The desktop navigation rail sits outside the shell; keep the existing bottom
  sheet below `2xl`.
- **States:** section links stay quiet by default and gain clear contrast on
  hover and keyboard focus; the rail scrolls independently when its contents
  exceed the viewport.
- **Layout:** at `2xl`, show a fixed `w-56` rail outside the article shell;
  never reserve article width for the ToC.
- **Accessibility:** use a labelled `nav`, real fragment links, and a labelled
  mobile open/close control.

## 6. Motion & Interaction

Motion communicates navigation, open/closed state, selection, or progress. Use
the existing Astro view transitions and short transform/opacity transitions for
control feedback. Respect `prefers-reduced-motion`; avoid decorative motion.
Focus rings remain visible in both color modes.

## 7. Depth & Surface

Use three surface levels: page canvas, card, and popover. Fine borders define
their edges; a restrained shadow may lift an interactive card or overlay. Keep
editorial rows unboxed. Do not use glass blur, decorative grid backdrops, or
shadows as a substitute for hierarchy.

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- Target WCAG 2.2 AA: semantic landmarks, one `h1`, contrast-safe token pairs,
  visible keyboard focus, and keyboard-reachable links and controls.
- Keep status meaning available in text or iconography as well as color.
- Preserve responsive layouts and reduced-motion behavior.
- Keep experience labels, dates, and long-form reading measures legible.

### Accepted Debt

The component implementation follows ReUI's Sera styling in Svelte rather than
using the official React registry components. This keeps the existing Astro and
Svelte architecture while preserving ReUI's semantic tokens and visual rules.
