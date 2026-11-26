# Website Product Contract

## Purpose

`ekel.dev` is Haikel Ilham Hakim's static personal website. It presents a biography, professional experience, selected work, technical notes, photography, and a small set of interactive public utilities.

## Primary surfaces

- Astro pages in `apps/web/src/pages` are static by default.
- MDX collections in `apps/web/src/content` own writing, work, and experience records.
- Svelte components are client islands only when interaction requires them.

## Design system

- Public routes and shared Svelte/Astro components follow the guestbook design
  system from `guestbook.ekel.dev`: its indigo accent, slate dark mode, a
  warm low-glare paper light mode, 14px
  interface text, 48rem column, and flat list panels
  (the guestbook keeps its card).
- The design system keeps the existing Astro and Svelte runtime; the
  guestbook's React and HeroUI components are not installed.
- Pages render straight into the shared Layout's column with no page frame.
  Lists of records render in `Panel` components; prose stays outside panels.
- `DESIGN.md` is the source of truth for color, typography, spacing, component
  states, motion, surface depth, and accessibility constraints.

## Deployment contract

- Cloudflare Pages hosts the static Astro output built with Bun. The existing
  Git/Moon build remains the fallback during the staged Wrangler rollout.
- The repository-root `.node-version` is the source of truth for the Node.js
  runtime required by Astro during deployment.
- Terraform owns durable Pages project, custom-domain, and optional DNS
  configuration after existing resources are imported and reviewed.
- GitHub Actions and Wrangler own static asset deployments; the workflow remains
  manual until its first production deployment is verified.

## Installable app

- Every public HTML route links a web app manifest, so Chromium browsers can
  install the site as a standalone app and iOS can add it to the home screen.
- App icons reuse the favicon's は glyph; the maskable icon keeps it inside the
  safe zone.
- The site registers no service worker; pages always load from the network.

## Navigation

- Navigation is a glass top bar, centered at the top of every viewport, with
  text links to Home, About, Works, Notes, Photos, then the theme toggle. The links
  render in static HTML.
- Page content fades out as it scrolls under the bar and toward the bottom
  edge of the viewport.
- At the top of a page the bar spans the content column with no border or
  shadow, so it reads as part of the page. Once the page scrolls, it shrinks
  to a bordered, shadowed pill as wide as its content. Phones do the same: the
  bar spans the viewport less 2rem at the top and shrinks to a pill around the
  avatar, theme toggle, and menu button, anchored to the top right.
- Below 640px the bar shows the owner's GitHub profile picture linking home,
  the theme toggle, and a menu button. The button opens a sheet listing every
  link with the current page marked; Escape and the close button dismiss it
  and return focus to the button.

## Page transitions

- Moving between pages keeps the navigation bar in place while the old page
  lifts away and the new one rises in; going back reverses the direction.
- From 640px the current-page highlight slides from the old link to the new
  one.
- Reduced motion turns every transition off.

## Footer

- The footer credits Astro and Svelte and links to Uptime, Guestbook, and
  Wakatime on the page canvas, above the bottom edge fade. Below 640px they
  stack and center; from 640px they split left and right.

## Photos page

- `/photos/` spans the full viewport width less the page gutters, unlike the
  42rem column the other routes use.
- The page shows only the gallery: no visible label, title, or description. A
  visually hidden `h1` names the page.
- Photos default to a grid of square, cropped tiles. A two-button switch above
  the gallery, at the right, changes to the bento (masonry) grid, which keeps
  each photo's shape. The browser remembers the choice; when storage is
  unavailable the gallery opens in square tiles.

## About page

- `/about/` shows the owner's GitHub profile picture, a short biography, and
  the current role.
- The current role lists every `experiences` record whose end date is
  `Present`: company, position, and start date. The page never restates that
  record in its source.
- The biography states only facts found elsewhere in the site's content.

## Homepage activity contract

- The intro shows the owner's GitHub profile picture above the description on
  phones and to its right from `sm`, separated by a 24px or 40px gap; the
  description is justified.

- The homepage presents Haikel's public GitHub contribution calendar in place
  of the former hero statement.
- Contribution data loads after hydration so provider downtime cannot block a
  static build.
- The loading state mirrors the calendar and year control with a reduced-motion
  safe skeleton instead of shifting from a text placeholder.
- A visible `#opentowork` availability badge sits beside the year control.
- Unknown provider data is parsed before display, and unavailable data receives
  an honest fallback state.
- The calendar scrolls within its own region at narrow widths without causing
  page-level horizontal overflow.
- Temporary: the calendar is off the homepage. The `#opentowork` badge sits at
  the top of the intro, and `/images/banner.png`, cropped to the characters,
  sits right-aligned on the card's bottom edge at up to 320px wide from 768px
  and is hidden below that. To restore, render `GitHubContributionGraph`
  (which includes the badge) in place of `OpenToWorkBadge` and drop the banner.

## Works contract

- Work records use the `company` or `personal` category; existing records
  default to personal.
- The homepage lists every company project and previews the first three
  personal projects in Works order, with links to their details and `/works`.
- `/works` lists all company projects first, followed by personal projects.
- Every project card shows its supplied thumbnail or a generated title image.

## Experience contract

- Every homepage experience summary comes from the `experiences` collection.
- Every record has a unique URL at `/experiences/<slug>`.
- The homepage shows only the company, role, and date range; highlights and the editable MDX narrative live on the detail page.
- Undisclosed employers stay undisclosed in all public content.
- Experience pages are content pages, not notes: they do not render a reaction control or make backend requests.

## Availability dialog

- The homepage `#opentowork` badge is a keyboard-accessible button opening job preferences independently of activity API availability.
- The dialog lists Fullstack Developer, Backend Developer, Frontend Developer, Devops Engineer, Software Engineer, and AI Engineer, followed by the supplied 20 technology labels.
- Keep the scrollable dialog composition on the existing shared Svelte Dialog primitives; do not add a React runtime.
- Content scrolls on short screens while the title and close control remain visible. Escape and the close button dismiss the dialog and restore trigger focus.

## Reading and portfolio patterns

- ToC preserves its desktop rail and mobile sheet; the current heading is highlighted and marked with `aria-current="location"`. Scrolling does not rewrite the URL.
- Homepage experiences render as compact rows in an Experience panel: company, role, dates, and the case-study link when one exists.
- Note and work rows show a one-line description of 90 characters or fewer.
- Every tag on a note row links to `/tags/<tag>/`, on the homepage, `/notes`, and tag pages alike.
- Tools use static decorative outline Icon Tiles; titles and descriptions remain the accessible content.
- Guestbook and market statuses use the shared semantic Alert variants. A refresh failure retains previously loaded messages.
- MDX code retains build-time syntax highlighting with filename/language, Copy and Wrap controls. Snippets longer than 16 lines can expand/collapse; copying always includes full source. Without JavaScript, the full code remains readable.
