# Ikuyo Design System

## 1. Atmosphere & Identity

Ikuyo uses the guestbook design system from `guestbook.ekel.dev`: a quiet,
app-like interface with one indigo accent, on warm paper neutrals in light mode
and cool slate in dark mode. Content sits
in a single 42rem column; lists sit flat on the canvas under a heading row with
a count pill, divided by hairlines. Typography sets Lora serif
titles over Inter body text, with hierarchy from the serif, weight, and muted
color more than size. Surfaces stay flat apart from one soft panel shadow and
the neutral fades at the top and bottom edges of the viewport. The
guestbook is built with HeroUI on React; Ikuyo ports its tokens and patterns to
Astro, Svelte, and Tailwind CSS without either runtime.

## 2. Color

Use semantic tokens for every interface color. The guestbook's own palette
(`--gb-*`) maps onto the shadcn token names that `@ikuyo/ui` reads.

| Role        | Token                | Guestbook      | Light                    | Dark                     |
| ----------- | -------------------- | -------------- | ------------------------ | ------------------------ |
| Canvas      | `--background`       | `--gb-page`    | `oklch(0.96 0.012 85)`   | `oklch(0.16 0.01 260)`   |
| Content     | `--foreground`       | `--gb-ink`     | `oklch(0.21 0.02 260)`   | `oklch(0.95 0.005 255)`  |
| Panel       | `--card`             | `--gb-surface` | `oklch(0.975 0.008 85)`  | `oklch(0.195 0.012 260)` |
| Overlay     | `--popover`          | overlay        | `oklch(0.975 0.008 85)`  | `oklch(0.22 0.012 260)`  |
| Raised      | `--secondary`        | `--gb-raised`  | `oklch(0.935 0.012 85)`  | `oklch(0.24 0.012 260)`  |
| Hover       | `--accent`           | `--gb-hover`   | `oklch(0.93 0.014 85)`   | `oklch(0.25 0.014 260)`  |
| Muted text  | `--muted-foreground` | `--gb-muted`   | `oklch(0.5 0.02 258)`    | `oklch(0.7 0.015 258)`   |
| Divider     | `--border`           | `--gb-divider` | `oklch(0.89 0.014 85)`   | `oklch(0.28 0.014 260)`  |
| Field edge  | `--input`            | `--gb-input`   | `oklch(0.865 0.016 85)`  | `oklch(0.32 0.014 260)`  |
| Accent      | `--primary`, `--ring`| `--gb-accent`  | `oklch(0.51 0.2 268)`    | `oklch(0.7 0.15 270)`    |
| Danger      | `--destructive`      | `--gb-danger`  | `oklch(0.6 0.21 25)`     | `oklch(0.66 0.2 25)`     |

- Light mode departs from the guestbook's near-white slate for eye comfort: a
  warm paper canvas (`#f5f1e9`), no pure-white surface, and less blue light.
  Ink, muted text, and the accent keep WCAG AA (4.5:1) on every light surface;
  the lowest pair is muted text on `--accent` at 4.88:1. `theme-color` and the
  web manifest use the canvas hex.
- `--accent` is the hover fill, as in shadcn; the brand accent is `--primary`.
- Info, success, and warning pairs stay for alerts and market data and sit on
  the same hue family; status never relies on color alone.
- Selection uses the accent at 22%; the caret uses the accent.
- Charts use `--chart-1` through `--chart-10`.

## 3. Typography

- Fonts: Inter (variable, 100 to 900) for body and
  interface text; Lora (variable, 400 to 700) for titles; Geist Mono for code
  only; Noto Naskh Arabic for Arabic display text. Load real weights; never
  rely on synthesized bold.
- Scale: Tailwind's default type scale, unmodified.
- Body: 16px (`text-base`) with 1.625 line-height (`leading-relaxed`).
- Titles: `h1`, `h2`, and dialog titles (`role="heading"` at levels 1 and 2)
  set in Lora at weight 500 with balanced wrapping and no negative tracking.
  Row titles (`h3`) stay in Inter.
- Page title: `text-2xl`, `md:text-3xl`, `leading-tight`.
- Panel and section titles: Lora `text-lg`, `leading-snug`.
- Row titles: Inter 16px medium.
- Labels above a title: 14px medium muted text. Never uppercase, never mono.
- Secondary text (row summaries, positions, highlights, dates): 14px
  (`text-sm`) muted; only row titles take full-strength ink. Dates and counts
  use `tabular-nums`.
- Tertiary text (tags, stacks, count pills): 12px (`text-xs`) muted.
- 16px reading text (intros, bios, page descriptions, article prose):
  `leading-reading` (1.8). 14px row text (summaries, highlights, tool
  descriptions, guestbook messages): `leading-relaxed` (1.625); at 1.8 the
  lines inside a list item sit almost as far apart as the items.
- Descriptions justify at every width with `hyphens-auto`: page header
  descriptions, the homepage intro, the About bio, row summaries, tool
  descriptions, Experience highlights, and article paragraphs and list items.
  Leave `text-pretty` off them; it shortens lines that justify then
  stretches. Titles, headings, metadata, and code stay left-aligned.
- Descriptions and article prose fill their row or column with no width cap;
  a cap left a blank strip beside the justified edge.
- Works rows on phones put the thumbnail beside the title only; the
  description and stack run under both at full row width, so justified lines
  keep their word gaps small.
- Arabic text uses `.arabic-font`, the loaded Noto Naskh Arabic (400 to 700),
  and never takes letter-spacing; tracking breaks the joins between letters.
- Metadata separates items with a middle dot (·), date ranges use an en dash
  (–), and dates read day, month, year: `d MMM yyyy` in lists and
  `d MMMM yyyy` on detail pages.
- Article headings: Lora semibold on an em scale (h1 1.75em, h2 1.25em, h3
  1.125em, h4 1em). Article links follow the site link rule (see Buttons and
  links) at medium weight; quotes use a 2px divider rule without quote marks.

## 4. Spacing & Layout

- One centered column, `max-w-2xl` (42rem), with 16px gutters on phones and
  24px from `sm`. No page card or frame wraps the content. `/photos` drops the
  cap so the gallery fills the viewport less its gutters.
- Page header: 16px top padding on phones and 32px from `sm` below the
  navigation, 24px bottom padding; content follows directly.
- Stack panels with a 24px gap. Panel rows pad 16px vertically and align to the
  column edges with no side padding.
- The footer spans the full viewport with a top divider, 64px above it, and
  its content aligns to the column. It sits on the canvas above the bottom
  edge fade (`relative z-40`), so its text stays sharp at the end of the page. On phones the copyright and links stack
  and center; from `sm` they split left and right.

## 5. Components

### Panel

- **Structure:** `Panel.astro` draws no card: no border, fill, shadow, or
  radius. A heading row (`h2`, 12px below it, divider under it) carries an
  optional count pill and an optional "View all" link. Rows separate
  themselves with a top border that the first row drops.
- **Rows:** `WorkRow`, `NoteRow`, and experience and role rows. A topline puts
  the title at the left and the date at the right; it stacks on phones. Titles
  are 16px medium links that turn accent on hover.
- **Guestbook:** `GuestbookEntries` keeps the original card (border, `bg-card`,
  `shadow-panel`, 10px radius) around its messages.
- **Use for:** every list of records. Free text and prose stay outside panels.

### Page header

- `PageHeader.astro`: muted label, page title, and a muted, justified
  description across the column.

### Buttons and links

- Buttons: 8px radius (`rounded-md`), 14px medium, `transition-colors`. Outline
  buttons sit on the panel surface; ghost buttons are muted text with a hover
  fill.
- Links: one rule in `base.css`. The text keeps its color, and a 35%
  current-color underline with a 4px offset darkens to full strength on hover.
  Inline links set no hover color of their own.
- List titles drop the underline and turn accent on hover. Nav links (top bar,
  sheet, footer, ToC, "View all") drop it and gain contrast on hover.

### Pills and badges

- Count pills, badges, and chips use the button radius, 8px (`rounded-md`),
  not a full pill: `bg-secondary`, 12px medium muted text. Tag links on
  `/tags` are outlined chips on the panel surface. Avatars and status dots stay
  round. Tags on
  note rows and detail pages are 12px muted underlined links, 12px apart.

### Navigation bar

- **Structure:** fixed at the top center above the safe area. From `sm` it
  holds the text links (Home, About, Works, Notes, Photos) and the theme toggle as a
  32px ghost icon button.
- **At the top of a page** (scroll under 10px): from `sm` the bar spans the
  content column (`min-width: min(39rem, 100% - 3rem)` on a fit-content bar)
  with links at the left and the toggle at the right, and on phones it spans
  the viewport less 2rem (`min-width: calc(100% - 2rem)`). Its border is
  transparent and it has no shadow, so it blends into the canvas.
- **Scrolled:** it returns to the pill, as wide as its content: from `sm` the
  min-width drops to 19rem, just under the ~23rem link row, and a hairline
  divider fades in before the toggle; on phones it drops to 6rem, just under
  the ~7rem avatar and controls. Both gain the divider border and
  `shadow-panel`.
- **Phones (below `sm`):** the bar holds the owner's 28px round GitHub avatar
  linking home at the left, and the theme toggle and a 32px "Open menu" ghost
  button at the right. It is anchored to the right gutter (`margin-right: 1rem`),
  so the scrolled pill sits at the top right and shrinks toward it; from `sm`
  the bar is centered. The button opens a top sheet titled "Menu" that lists the same
  links as 44px rows with the current page marked; choosing a link closes it.
- **Surface:** the guestbook topbar recipe: page color at 85%, a 12px backdrop
  blur, and a 10px radius in both states. This is the only blurred surface.
- **Edge fades:** fixed, non-interactive strips (`z-40`) fade from the canvas
  to transparent, so content fades as it scrolls under them: 4rem plus the top
  safe area under the bar (it ends just below the ~3.5rem bar and stays when
  the bar hides), and 2rem plus the bottom safe area at the bottom edge. The
  footer and the ToC button paint above the bottom fade.
- **States:** links are 14px medium muted text with a 6px radius, a hover
  fill, and a raised fill plus full-strength text and `aria-current="page"`
  for the current page.
- **Motion:** the bar hides on scroll down and returns on scroll up. Its
  position, min-width, border color, and shadow share one 300ms transition.
  Animating min-width, a plain length, keeps the shrink smooth in every
  browser. Reduced motion removes the transition.

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

### Photo gallery

- `/photos` shows the gallery alone, with a visually hidden `h1`. A right-aligned
  group of two 32px ghost icon buttons (Square grid, Bento grid) sits above it;
  the pressed one takes the raised fill and full-strength text, like the
  current nav link, and carries `aria-pressed`.
- Square tiles (default) crop each photo to `aspect-square` with
  `object-cover`. Bento is the masonry layout that keeps each photo's shape.
  Both use 2 columns on phones, 3 from `md`, 4 from `lg`, and a 16px gap, so
  switching never changes the column count.
- The choice persists in `localStorage` (`photos-layout`) as a per-browser
  convenience.
- Photo grids inside notes and works keep their 4:3 tiles that stay grayscale
  until hover.

### Code block

- Static syntax highlighting, 14px mono, a compact filename and language
  toolbar with Copy and Wrap buttons, and an explicit expand action for long
  snippets. No client-side highlighter.

## 6. Motion & Interaction

- Color transitions run about 150ms; no `transition-all`.
- Route changes use Astro's `ClientRouter` and native view transitions,
  styled in `src/styles/animations.css`:
  - The page is the root snapshot (the viewport); `<body>` carries no
    transition name, so a scrolled page never slides from its scroll offset.
  - Forward: the old page fades out while lifting 8px (160ms, ease-in); the
    new page rises 16px into place (360ms, `cubic-bezier(0.22, 1, 0.36, 1)`,
    60ms delay). Back (`data-astro-transition="back"`) reverses both
    directions.
  - The nav bar (`site-nav`) and the edge fades (`site-fade`,
    `site-fade-bottom`) are their own snapshots and swap without fading.
    The current-page fill is a separate `nav-pill` snapshot that slides to
    the new link in 360ms; link labels (`nav-label` class) sit above it.
  - Content inside the page never staggers in.
- `prefers-reduced-motion` removes transitions and every view-transition
  animation.

## 7. Depth & Surface

- Three levels: page canvas, card (`--card` plus `shadow-panel`, now only the
  guestbook and the scrolled navigation bar), overlay (`--popover`).
- Lists of notes, works, and experiences sit on the canvas; dividers, not
  cards, separate their rows.
- Blur appears only on the navigation bar. Gradients appear only as the
  neutral canvas-to-transparent fades at the top and bottom viewport edges.

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
