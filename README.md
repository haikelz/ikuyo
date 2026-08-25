# Ikuyo

[ekel.dev](https://ekel.dev) is Haikel Ilham Hakim's statically generated
personal website. It publishes professional experience, selected work,
technical notes, photography, and a few interactive utilities while keeping
most pages pre-rendered at build time.

## Technology

| Concern             | Implementation                                |
| ------------------- | --------------------------------------------- |
| Web framework       | Astro 6, static output                        |
| Interactive islands | Svelte 5                                      |
| Styling             | Tailwind CSS 4 and custom CSS                 |
| Shared UI           | shadcn-svelte primitives in `packages/ui`     |
| Content             | Typed Astro collections with MDX              |
| Fonts               | Geist Sans, Geist Mono, and Noto Naskh Arabic |
| Workspace           | Bun workspaces and Moon                       |
| Quality             | Astro Check, Biome, Cypress, Lighthouse CI    |
| Monitoring          | Sentry                                        |

Astro owns routes, layouts, content rendering, and static generation. Svelte is
reserved for components that need client-side interaction, such as theme,
navigation, charts, reactions, and photo controls.

## Public routes

- `/` — biography, experience, featured work, and latest notes
- `/experiences/<slug>` — professional experience details
- `/works` and `/works/<slug>` — project portfolio
- `/notes` and `/notes/<slug>` — writing
- `/tags` and `/tags/<slug>` — note indexes by tag
- `/photos` — photography
- `/guestbook` — visitor messages
- `/now` — current activities
- `/uses` — hardware and software
- `/wakatime` — coding activity
- `/ihsg` — stock-index viewer

There is intentionally no `/experiences` index route. Content routes are built
from records in `apps/web/src/content`, not duplicated in page modules.

## Repository layout

```text
ikuyo/
├── apps/web/
│   ├── cypress/                 # Browser-level behavior and accessibility
│   └── src/
│       ├── components/          # Site-specific Astro and Svelte components
│       ├── content/             # Notes, works, and experiences as MDX
│       ├── content.config.ts    # Collection schemas and loaders
│       ├── layouts/             # Shared page shell
│       ├── pages/               # Astro file-based routes
│       ├── styles/              # Global theme, prose, and utility CSS
│       └── utils/               # Content, environment, and rendering helpers
├── packages/ui/                 # Shared Svelte UI primitives
├── docs/                        # Product contracts and Harness documentation
├── scripts/                     # Harness bootstrap, CLI, and schema
├── AGENTS.md                    # Agent entrypoint for every request
└── DESIGN.md                    # Visual-system contract
```

## Local development

Requirements:

- [Bun](https://bun.sh/)
- [Node.js 22.16.0](https://nodejs.org/) (pinned by `.node-version` for Astro
  and Cloudflare Pages)

Install dependencies and start the Astro development server:

```bash
bun install
bun run dev:web
```

The site is available at `http://localhost:3000`.

## Commands

Run commands from the repository root unless noted otherwise.

```bash
bun run dev:web                    # Start the web development server
bun run --cwd apps/web build       # Astro check and production build
bun run build:web                  # Format workspaces, then build through Moon
bun run lint:biome                 # Check web and shared UI source
bun run format:biome               # Format web and shared UI source
bun run test:web                   # Start the site and run all Cypress tests
bun run lhci:mobile                # Lighthouse CI mobile preset
bun run lhci:desktop               # Lighthouse CI desktop preset
```

`build:web` writes formatting changes before building. Use
`bun run --cwd apps/web build` when you need a non-formatting build check.

## Environment

Copy the example file before using integrations that require credentials:

```bash
cp apps/web/.env.example apps/web/.env
```

The example declares production/development URLs, Turso credentials, Sentry,
Lighthouse CI, ImageKit, and Cloudflare values. Keep secrets out of version
control. The static content pages can be developed without every external
integration configured, but affected integrations need their matching values.

## Content workflow

Collection contracts live in `apps/web/src/content.config.ts`. Add or update an
MDX record under the matching collection:

- `apps/web/src/content/notes`
- `apps/web/src/content/works`
- `apps/web/src/content/experiences`

Dynamic routes use Astro `getStaticPaths`, `getCollection`, and `render` to
produce one static page per record. Update the collection schema rather than
adding untyped or duplicated page data.

## Engineering Harness

This repository includes a local engineering Harness that turns requests into
bounded, validated work. `AGENTS.md` is the entrypoint. Human-readable policy
and product truth live in `docs`; operational records live in the ignored
`harness.db` through `scripts/bin/harness-cli`.

For change requests, the workflow is:

```text
intent → intake and risk lane → story/proof scope → implementation
       → validation → trace → captured friction
```

Bootstrap local Harness state when needed:

```bash
scripts/bootstrap-harness.sh
scripts/bin/harness-cli query matrix --active --summary
```

Read `docs/README.md` and `docs/HARNESS.md` for the full workflow. Read-only
requests do not mutate Harness state; build, fix, and edit requests record
intake and a completion trace.

## License

MIT
