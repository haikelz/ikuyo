<img src="https://github.com/Safouene1/support-palestine-banner/blob/master/banner-support.svg" width="100%" />

# ikuyo

Personal monorepo for [ekel.dev](https://ekel.dev) — a static personal site built with Astro and Svelte.

## Repository Structure

```
.
├── apps
│   └── web                  # Main web application (Astro + Svelte)
│       ├── public/          # Static assets (images, fonts, etc.)
│       ├── scripts/         # Build-time utility scripts
│       └── src/
│           ├── components/  # Astro and Svelte components
│           ├── content/     # MDX content collections (notes, works)
│           ├── helpers/     # Shared helper functions
│           ├── layouts/     # Page layout components
│           ├── pages/       # File-based routes
│           └── utils/       # Utility functions and integrations
└── packages
    ├── biome                # Shared Biome (linter/formatter) config
    └── typescript           # Shared TypeScript config
```

## Tech Stack

| Layer         | Technology                                      |
| ------------- | ----------------------------------------------- |
| Framework     | [Astro 5](https://astro.build) (static output)  |
| UI Components | [Svelte 5](https://svelte.dev)                  |
| Styling       | [Tailwind CSS v4](https://tailwindcss.com)      |
| Content       | MDX via `@astrojs/mdx`                          |
| Package Manager | [Bun](https://bun.sh)                         |
| Monorepo      | [Moonrepo](https://moonrepo.dev)                |
| Error Tracking | [Sentry](https://sentry.io)                   |
| Media CDN     | [ImageKit](https://imagekit.io)                 |
| Database      | [Turso](https://turso.tech) (libSQL)            |

## Prerequisites

- [Bun](https://bun.sh) >= 1.0
- [Moon](https://moonrepo.dev/moon) — install via `bun install -g @moonrepo/cli`

## Getting Started

```bash
# Install dependencies
bun install

# Start the development server (http://localhost:3000)
bun dev:web

# Build for production
bun build:web
```

## Available Scripts

### Root (monorepo)

| Script           | Description                           |
| ---------------- | ------------------------------------- |
| `bun dev:web`    | Start `apps/web` dev server           |
| `bun build:web`  | Production build for `apps/web`       |
| `bun test:web`   | Run Cypress tests for `apps/web`      |

### `apps/web`

| Script                   | Description                                      |
| ------------------------ | ------------------------------------------------ |
| `bun run dev`            | Start Astro dev server                           |
| `bun run build`          | Type-check then build (`astro check && astro build && compress-photos`) |
| `bun run preview`        | Preview the production build locally             |
| `bun run lint:biome`     | Lint with Biome                                  |
| `bun run format:biome`   | Format with Biome                                |
| `bun run test`           | Run Cypress E2E tests                            |

## Pages

| Route              | Description                                     |
| ------------------ | ----------------------------------------------- |
| `/`                | Home — bio, experience, and recent content      |
| `/notes`           | Blog-style notes (MDX)                          |
| `/notes/[slug]`    | Individual note page                            |
| `/works`           | Portfolio of personal projects                  |
| `/works/[slug]`    | Individual work page                            |
| `/tags/[tag]`      | Notes filtered by tag                           |
| `/photos`          | Photo gallery served from ImageKit              |
| `/guestbook`       | Guestbook (Turso-backed)                        |
| `/now`             | Current focus and activities                    |
| `/uses`            | Tools and setup                                 |
| `/wakatime`        | Coding activity from WakaTime                   |
| `/eid-al-fitr`     | Eid Al-Fitr greeting (bilingual ID/EN)          |

## Content Collections

Content is managed via Astro's Content Collections API (`src/content/config.ts`).

**`notes`** — MDX blog posts

```ts
{
  author: string;
  title: string;
  description: string;
  created_at: Date;
  tags: string[];
}
```

**`works`** — Portfolio projects

```ts
{
  id: number;
  author: string;
  thumbnail: string; // must be an https URL
  title: string;
  stack: string[];
  repo?: string;
  preview?: string;
  description: string;
}
```

## Build Pipeline

The production build runs three steps in sequence:

```
astro check → astro build → bun scripts/compress-photos.ts
```

1. **`astro check`** — TypeScript type-checking across the entire project
2. **`astro build`** — Static site generation; copies `public/images/photos/` to `dist/`
3. **`compress-photos.ts`** — Re-compresses images in `dist/images/photos/` using `sharp` (only writes if the result is smaller than the original)

## Environment Variables

Copy `.env.example` to `.env` inside `apps/web/` and fill in the values:

```env
PUBLIC_PRODUCTION_URL       # Production base URL
PUBLIC_DEVELOPMENT_URL      # Development base URL
TURSO_DATABASE_URL          # Turso database URL
TURSO_AUTH_TOKEN            # Turso auth token
IMAGEKIT_PRIVATE_KEY        # ImageKit private key (used at build time)
SENTRY_DSN                  # Sentry DSN
SENTRY_PROJECT              # Sentry project slug
SENTRY_AUTH_TOKEN           # Sentry auth token (for source map upload)
CLOUDFLARE_API_TOKEN        # Cloudflare API token (for deployment)
CLOUDFLARE_ACCOUNT_ID       # Cloudflare account ID
NODE_VERSION                # Node.js version override (used by Cloudflare)
```

## Shared Packages

### `@ikuyo/typescript`

Base `tsconfig.json` extended by all apps and packages. Located at `packages/typescript/base.json`.

### `@ikuyo/biome`

Shared [Biome](https://biomejs.dev) configuration for linting and formatting, extended by `apps/web/biome.json`.

## License

MIT
