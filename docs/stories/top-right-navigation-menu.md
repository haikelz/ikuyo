# Top-Right Navigation Menu

## Status

implemented

## Lane

normal

## Product Contract

Site navigation is a minimal top-right pair of controls: the theme toggle and a
menu button that opens a dropdown of icon-and-label links.

## Relevant Product Docs

- `docs/product/website.md`
- `DESIGN.md` (Navigation menu)

## Acceptance Criteria

- No top bar, bottom bar, or mobile menu sheet; two 32px outline icon buttons
  styled like the ToC button sit at the top right at 375, 768, and 1280px.
- The dropdown lists Home, Works, Notes, Tags, Photos, and Guestbook with icons
  and labels; the current page shows a dot and `aria-current`, distinct from the
  keyboard highlight.
- Links keep their `data-cy` hooks; the menu button is `nav-menu-btn`.
- The menu opens by pointer and keyboard, moves with arrow keys, and closes on
  Escape.
- Focus outlines follow each control's shape; link labels are not underlined.

## Design Notes

- The menu uses a new `DropdownMenu` primitive in `@ikuyo/ui` (Root, Trigger,
  Content, Item) on bits-ui, following the shadcn dropdown pattern that ReUI's
  dropdown examples build on, with the same surface and motion as Select.
  An earlier native `popover` version was replaced at the owner's request.
- Dropdown items render only when the menu opens, so the nav links no longer
  sit in static HTML; the sitemap and in-page links still reach every page.
- The navbar hydrates with `client:load`; specs that use the theme toggle or
  menu wait for hydration.
- Unlayered global styles in `base.css` (`:focus-visible` with
  `border-radius: inherit`, and underlined bold links) override layered
  utilities, so controls use `rounded-md!`, `outline-none!`, `font-medium!`,
  and `no-underline!`.
- The Layout container top padding is `pt-20` to clear the controls.
- A floating bottom bar was built first and replaced before commit at the
  owner's request (story `floating-bottom-navbar`, retired).

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Not applicable |
| Integration | Build passes; static HTML contains the Primary nav and its links |
| E2E | theme, markdown-processing, seo specs; menu screenshots at three widths |
| Platform | Not applicable |
| Release | Not applicable |

## Harness Delta

None.

## Evidence

- Screenshots at 375, 768, and 1280px: two round controls at the top right;
  the open dropdown lists all six links with icons, highlights the current
  page, and works in dark mode.
- Earlier native popover version: a temporary Cypress spec opened the menu by
  click and by keyboard Enter,
  closed it with its button, and navigated to Notes from it. Escape and
  outside-click dismissal come from the native popover; Cypress synthetic and
  CDP key events cannot trigger them inside its iframe.
- Focus outlines follow the round menu button and rounded links; menu labels
  report `text-decoration-line: none`.
- `bunx cypress run`: theme 6/6, markdown-processing 3/3, seo 5/5.
- `bun run lint:biome` passed (two existing CSS warnings, one info).
- `bun run --cwd apps/web build` passed: `astro check` 0 errors, 94 pages;
  built pages included the Primary nav and, in the popover version, its links.
- Owner follow-up: the theme and menu buttons now use the ToC button styling;
  a check confirmed the menu button's size and radius equal the ToC button's
  and the theme trigger is 32x32px. theme 6/6.
- Owner follow-up: the menu now uses the `DropdownMenu` primitive. A Cypress
  check opened it by click and Enter, moved with arrow keys, closed it with
  Escape, navigated to Tags, and confirmed no square focus frame; screenshots at
  375 and 1280px and dark mode. theme 6/6 (warm), seo 5/5.
