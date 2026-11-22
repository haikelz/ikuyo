# Ikuyo Design System

## 1. Atmosphere & Identity

Ikuyo uses the guestbook design system from `guestbook.ekel.dev`: a quiet,
app-like interface on cool slate neutrals with one indigo accent. Content sits
in a single 48rem column; lists live in bordered panels with a heading row,
a count pill, and divided rows. Text is small and even, hierarchy comes from
weight and muted color rather than size, and surfaces stay flat apart from one
soft panel shadow. The guestbook is built with HeroUI on React; Ikuyo ports its
tokens and patterns to Astro, Svelte, and Tailwind CSS without either runtime.

## 2. Color

Use semantic tokens for every interface color. The guestbook's own palette
(`--gb-*`) maps onto the shadcn token names that `@ikuyo/ui` reads.

| Role        | Token                | Guestbook      | Light                    | Dark                     |
| ----------- | -------------------- | -------------- | ------------------------ | ------------------------ |
| Canvas      | `--background`       | `--gb-page`    | `oklch(0.985 0.003 255)` | `oklch(0.16 0.01 260)`   |
| Content     | `--foreground`       | `--gb-ink`     | `oklch(0.21 0.02 260)`   | `oklch(0.95 0.005 255)`  |
| Panel       | `--card`             | `--gb-surface` | `oklch(1 0 0)`           | `oklch(0.195 0.012 260)` |
| Overlay     | `--popover`          | overlay        | `oklch(1 0 0)`           | `oklch(0.22 0.012 260)`  |
| Raised      | `--secondary`        | `--gb-raised`  | `oklch(0.96 0.005 255)`  | `oklch(0.24 0.012 260)`  |
| Hover       | `--accent`           | `--gb-hover`   | `oklch(0.955 0.008 255)` | `oklch(0.25 0.014 260)`  |
| Muted text  | `--muted-foreground` | `--gb-muted`   | `oklch(0.5 0.02 258)`    | `oklch(0.7 0.015 258)`   |
| Divider     | `--border`           | `--gb-divider` | `oklch(0.915 0.008 255)` | `oklch(0.28 0.014 260)`  |
| Field edge  | `--input`            | `--gb-input`   | `oklch(0.89 0.01 255)`   | `oklch(0.32 0.014 260)`  |
| Accent      | `--primary`, `--ring`| `--gb-accent`  | `oklch(0.51 0.2 268)`    | `oklch(0.7 0.15 270)`    |
| Danger      | `--destructive`      | `--gb-danger`  | `oklch(0.6 0.21 25)`     | `oklch(0.66 0.2 25)`     |

- `--accent` is the hover fill, as in shadcn; the brand accent is `--primary`.
- Info, success, and warning pairs stay for alerts and market data and sit on
  the same hue family; status never relies on color alone.
- Selection uses the accent at 22%; the caret uses the accent.
- Charts use `--chart-1` through `--chart-10`.

## 3. Typography

- Font: Plus Jakarta Sans. Geist Mono is for code only; Noto Naskh Arabic for
  Arabic display text.
- Scale: Tailwind's default type scale, unmodified, as on the guestbook.
- Interface text: 14px (`text-sm`) with 1.5 line-height; this is the body size.
- Page title: `text-2xl`, `sm:text-[1.75rem]`, semibold, `tracking-tight`,
  `leading-tight`.
- Panel and section titles: 14px semibold.
- Labels above a title: 14px medium muted text. Never uppercase, never mono.
- Metadata, dates, counts: 12px (`text-xs`) muted with `tabular-nums`.
- Reading text (bios, intros longer than a sentence, article prose): 16px with
  1.625 to 1.75 line-height, left-aligned, never justified, at most 70ch.

## 4. Spacing & Layout

- One centered column, `max-w-3xl` (48rem), with 16px gutters on phones and
  24px from `sm`. No page card or frame wraps the content.
- Page header: 16px top padding on phones and 32px from `sm` below the
  navigation, 24px bottom padding; content follows directly.
- Stack panels with a 24px gap. Panel rows pad 16px vertically and 16px or 20px
  horizontally.
- The footer spans the full viewport with a top divider, 64px above it, and
  its content aligns to the column.

## 5. Components

### Panel

- **Structure:** `Panel.astro`: `rounded-lg` (10px) border, `bg-card`,
  `shadow-panel`, clipped corners. A heading row (14px semibold `h2`, divider
  below) carries an optional count pill and an optional "View all" link. Rows
  separate themselves with a top border that the first row drops.
- **Rows:** `WorkRow`, `NoteRow`, experience and role rows, guestbook
  messages. A topline puts the title at the left and the date at the right;
  it stacks on phones. Titles are 14px medium links that turn accent on hover.
- **Use for:** every list of records. Free text and prose stay outside panels.

### Page header

- `PageHeader.astro`: muted label, page title, and a muted description capped
  at 46ch.

### Buttons and links

- Buttons: 8px radius (`rounded-md`), 14px medium, `transition-colors`. Outline
  buttons sit on the panel surface; ghost buttons are muted text with a hover
  fill.
- Links: underlined with a 4px offset and a 35% current-color line. List
  titles and nav links drop the underline.

### Pills and badges

- Count pills and badges are fully rounded: `bg-secondary`, 12px medium muted
  text. Tag links on `/tags` are outlined pills on the panel surface.

### Navigation bar

- **Structure:** fixed at the top center above the safe area, as wide as its
  content and never wider than the viewport less 2rem. Text links to Home,
  About, Works, Notes, Tags, Photos, and Guestbook, a hairline divider, then
  the theme toggle as a 32px ghost icon button.
- **Surface:** the guestbook topbar recipe: page color at 85%, a 12px backdrop
  blur, a divider border, `shadow-panel`, and a 10px radius. This is the only
  blurred surface.
- **States:** links are 14px medium muted text with a 6px radius, a hover
  fill, and a raised fill plus full-strength text and `aria-current="page"`
  for the current page.
- **Narrow screens:** the link strip scrolls sideways inside the bar with its
  scrollbar hidden; the current page's link starts in view.
- **Motion:** the bar hides on scroll down and returns on scroll up with a
  200ms transform; reduced motion removes it.

### Alerts, fields, dialogs, and sheets

- Alerts: info for loading or unavailable data, warning for stale or partial
  data, destructive for failed requests.
- Fields use `--input` edges and the accent caret and focus.
- Dialogs and sheets use the overlay surface, a divider border, and
  `shadow-panel`, with focus management from the Svelte primitives.

### Table of contents

- Notes and Works detail pages fill the column. At `2xl` a fixed `w-56` rail
  sits outside it; below `2xl` a labelled button opens the sheet. Section
  links stay quiet and gain contrast on hover and focus.

### Code block

- Static syntax highlighting, 14px mono, a compact filename and language
  toolbar with Copy and Wrap buttons, and an explicit expand action for long
  snippets. No client-side highlighter.

## 6. Motion & Interaction

- Color transitions run about 150ms; no `transition-all`.
- Astro route changes use a brief opacity cross-fade; page content never
  slides or staggers in.
- `prefers-reduced-motion` removes transitions.

## 7. Depth & Surface

- Three levels: page canvas, panel (`--card` plus `shadow-panel`), overlay
  (`--popover`).
- Dividers, not nested cards, separate content inside a panel.
- Blur appears only on the navigation bar.

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- Target WCAG 2.2 AA: semantic landmarks, one `h1`, contrast-safe token pairs,
  keyboard-reachable links and controls.
- Focus: a 2px accent outline with a 2px offset on every focusable element.
  The global rule lives in `@layer base`, so a utility can replace it, but only
  with another visible indicator; never ship `outline-none` alone.
- Keep status meaning available in text or iconography as well as color.
- Preserve responsive layouts and reduced-motion behavior.

### Accepted Debt

- The guestbook's HeroUI components are React; Ikuyo reproduces their look
  through `@ikuyo/ui` Svelte primitives and Tailwind classes, so upstream
  HeroUI updates do not flow in.
