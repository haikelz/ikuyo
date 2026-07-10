# ikuyo

Personal website — [ekel.dev](https://ekel.dev)

Built with Astro, Svelte 5, Tailwind CSS 4, and Moonrepo. Has light/dark mode, clean typography, and core a11y.

## Stack

| Layer | Tech |
|---|---|
| Framework | [Astro 6](https://astro.build) |
| Components | [Svelte 5](https://svelte.dev) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) + typography plugin |
| UI primitives | [shadcn-svelte](https://shadcn-svelte.com) (bits-ui) |
| Fonts | Geist Sans, Geist Mono, Noto Naskh Arabic |
| Build | [Moonrepo](https://moonrepo.dev) |
| Content | MDX with Shiki syntax highlighting |
| Monitoring | Sentry, GoatCounter, Lighthouse CI |
| Testing | Cypress E2E |
| Formatting | Biome |

## Pages

- `/` — Home (bio, experience, featured works, latest notes)
- `/works` — Project portfolio
- `/notes` — Writing
- `/tags` — Tag index
- `/photos` — Street/cosplayer photography
- `/guestbook` — Messages from visitors
- `/now` — What I'm doing now
- `/uses` — Hardware and software setup
- `/wakatime` — Coding activity stats
- `/ihsg` — Stock market index viewer

## Project Structure

```
ikuyo
├── apps
│   └── web          # Astro main site
│       ├── src
│       │   ├── components  # Astro + Svelte components
│       │   ├── layouts     # Page layout shell
│       │   ├── pages       # Routes (file-based)
│       │   ├── styles      # CSS modules
│       │   └── utils       # Helpers, rehype/remark plugins
│       └── cypress         # E2E tests
└── packages
    └── ui                 # Shared Svelte UI components
```

## Getting Started

```bash
bun install
bun run dev:web
```

Site runs at `http://localhost:3000`.

```bash
bun run build:web   # Production build
bun run test:web    # Cypress E2E
bun run lint:biome  # Lint
```

## Environment

Copy `apps/web/.env.example` to `apps/web/.env` and fill in:

- `PUBLIC_GOATCOUNTER_SRC` — Analytics
- `SENTRY_DSN` / `SENTRY_AUTH_TOKEN` / `SENTRY_PROJECT` — Error monitoring
- `BACKEND_API_URL` — API for guestbook and wakatime data

## License

MIT
