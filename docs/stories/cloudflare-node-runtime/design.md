# Design

## Domain Model

No product-domain change.

## Application Flow

Cloudflare reads `.node-version`, installs Node.js 22.16.0, and then runs the
existing `bun run build:web` command. Moon continues to run Astro's check and
build tasks.

## Interface Contract

No route, API, content, or command contract changes.

## Data Model

No schema, migration, deletion, or retention change.

## UI / Platform Impact

The Cloudflare Pages build environment moves from unsupported Node.js 20.17.0
to Node.js 22.16.0. Local tools that honor `.node-version` use the same runtime.

## Observability

Cloudflare build logs should report Node.js 22.16.0 and proceed beyond
`web:check`. Moon's shallow-checkout warning can remain because it is not the
task failure.

## Alternatives Considered

1. Set `NODE_VERSION` only in the Cloudflare dashboard. Rejected because it is
   hidden shared state and cannot be reviewed with the code that requires it.
2. Add only `package.json#engines`. Rejected because Cloudflare's current build
   system does not use that field to select Node.js.
3. Add `.node-version`. Selected because Cloudflare supports it directly and it
   keeps the deployment runtime versioned in the repository.
