<img src="https://github.com/Safouene1/support-palestine-banner/blob/master/banner-support.svg" width="100%" />

# ikuyo

Personal monorepo for [ekel.dev](https://ekel.dev) — a static personal site built with Astro and Svelte.

## Repository Structure

```
.
├── .moon/                   # Moon workspace + shared task presets (extends official Astro tasks)
├── apps
│   └── web                  # Main web application (Astro + Svelte)
│       ├── public/          # Static assets (images, fonts, etc.)
│       └── src/
│           ├── components/  # Astro and Svelte components
│           ├── content/     # MDX content collections (notes, works)
│           ├── helpers/     # Shared helper functions
│           ├── layouts/     # Page layout components
│           ├── pages/       # File-based routes (including og/, notes/, works/, tags/)
│           └── utils/       # Utilities, env, ImageKit, rehype/remark plugins
├── packages
│   ├── biome                # Shared Biome (linter/formatter) config
│   └── typescript           # Shared TypeScript config
├── references/              # Optional writing/reference snippets (not part of the app build)
└── SKILL.md                 # Cursor skill / project notes (local workflow)
```

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Framework | [Astro 5](https://astro.build) (`output: "static"`) |
| UI | [Svelte 5](https://svelte.dev) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com), `@tailwindcss/typography` |
| Content | MDX via `@astrojs/mdx`, Content Collections |
| Build / monorepo | [Bun](https://bun.sh), [Moonrepo](https://moonrepo.dev) (Astro task preset from [moon-configs](https://github.com/moonrepo/moon-configs)) |
| OG images | [astro-og-canvas](https://github.com/delucis/astro-og-canvas) + CanvasKit |
| Compression | `astro-compressor` (gzip/brotli), `@playform/compress` |
| Observability | [Sentry](https://sentry.io) (`@sentry/astro`, `@sentry/cloudflare`) |
| Media | [ImageKit](https://imagekit.io) (API + CDN for `/photos`) |
| Data | [Turso](https://turso.tech) (libSQL) for guestbook |
| HTTP client | [ky](https://github.com/sindresorhus/ky) |
| Charts | [Chart.js](https://www.chartjs.org/) (e.g. Wakatime page) |
| Dates | [date-fns](https://date-fns.org/) |
| E2E | [Cypress](https://www.cypress.io/) |
| CI / perf | [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) (`lhci` scripts at repo root) |

## Prerequisites

- [Bun](https://bun.sh) >= 1.0
- [Moon](https://moonrepo.dev/moon) — e.g. `bun install -g @moonrepo/cli`

## Getting Started

```bash
bun install
bun dev:web      # http://localhost:3000 (see apps/web/astro.config.ts for port)
bun build:web    # runs Moon task chain for @ikuyo/web
```

## Available Scripts

### Root (monorepo)

| Script | Description |
| ------ | ----------- |
| `bun dev:web` | `moon run web:dev` |
| `bun build:web` / `bun build:web:prod` | `moon run web:build` |
| `bun test:web` | `moon run web:test` (Cypress) |
| `bun lhci:mobile` | Lighthouse CI (mobile preset) |
| `bun lhci:desktop` | Lighthouse CI (desktop preset) |

### `apps/web`

Moon delegates `dev`, `build`, `check`, and `test` to this package using the shared Astro task definitions. Locally you can also run:

| Script | Description |
| ------ | ----------- |
| `bun run dev` / `start` | Astro dev server |
| `bun run build` | `astro check && astro build` |
| `bun run preview` | Preview production output |
| `bun run lint:biome` | Biome check |
| `bun run format:biome` | Biome format (write) |
| `bun run test` | Cypress run |
| `bun run lhci:mobile` / `lhci:desktop` | Lighthouse from app context |

## Pages & Endpoints

| Route | Description |
| ----- | ----------- |
| `/` | Home — bio, experience, recent notes/works |
| `/notes`, `/notes/[...slug]` | Notes index and posts (MDX) |
| `/works`, `/works/[...slug]` | Portfolio index and project pages |
| `/tags`, `/tags/[...slug]` | All tags and notes filtered by tag |
| `/photos` | Gallery (ImageKit API at build time; client grid + lightbox) |
| `/guestbook` | Guestbook (Turso) |
| `/now` | Current focus |
| `/uses` | Tools and setup |
| `/wakatime` | Coding activity |
| `/eid-al-fitr` | Eid greeting (ID / EN toggle) |
| `/og/[...route]` | Dynamic Open Graph images (static paths from content + static pages) |
| `/rss.xml`, `/robots.txt` | RSS and robots |
| `/404`, `/500` | Error pages |

## Content Collections

Configured in `apps/web/src/content/config.ts`.

**`notes`** — MDX

```ts
{ author, title, description, created_at: Date, tags: string[] }
```

**`works`** — MDX

```ts
{ id, author, thumbnail /* https */, title, stack, repo?, preview?, description }
```

## Build Pipeline

- **Moon**: `apps/web` uses `.moon/tasks/tag-astro.yml`, which extends the official [Astro Moon task preset](https://github.com/moonrepo/moon-configs) (`build` depends on `check`).
- **`apps/web` `build` script**: `astro check` then `astro build` — static output to `dist/`, sitemap, HTML/asset compression integrations as configured in `astro.config.ts`.

## Environment Variables

Copy `apps/web/.env.example` to `apps/web/.env` and set values as needed:

| Variable | Role |
| -------- | ---- |
| `PUBLIC_PRODUCTION_URL` / `PUBLIC_DEVELOPMENT_URL` | Site URLs |
| `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` | Guestbook database |
| `IMAGEKIT_PRIVATE_KEY` / `IMAGEKIT_API_BASE_URL` | List photos for `/photos` at build time |
| `SENTRY_DSN` / `SENTRY_PROJECT` / `SENTRY_AUTH_TOKEN` | Error reporting and source map upload |
| `BACKEND_API_URL` | Optional backend base URL |
| `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` | Deployment (e.g. Pages) |
| `NODE_VERSION` | Optional override for hosted Node version |
| `LHCI_GITHUB_APP_TOKEN` | Lighthouse CI (if used) |

## Shared Packages

### `@ikuyo/typescript`

Base TS config: `packages/typescript/base.json`, extended by `apps/web/tsconfig.json`.

### `@ikuyo/biome`

Shared [Biome](https://biomejs.dev) preset (`packages/biome/astro.json`), extended by `apps/web/biome.json`.

## License

MIT
