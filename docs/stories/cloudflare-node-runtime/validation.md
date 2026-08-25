# Validation

## Proof Strategy

Confirm the pinned Node release satisfies Astro's minimum, keep TypeScript on a
version supported by Astro's checker and Svelte integration, and run the
existing static production build. The next Cloudflare build is the final
platform proof.

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit | Not applicable; declarative runtime file |
| Integration | Frozen install, Astro check, and static production build under supported Node and TypeScript releases |
| E2E | Existing page behavior is unchanged |
| Platform | Cloudflare detects Node.js 22.16.0 and proceeds beyond `web:check` |
| Performance | Not applicable |
| Logs/Audit | Build log reports the selected Node release |

## Fixtures

- Cloudflare Pages failure log showing Node.js 20.17.0.
- Cloudflare build-image documentation.
- Astro installation prerequisites.

## Commands

```text
node --version
bun install --frozen-lockfile
bun run --cwd apps/web astro -- check
bun run --cwd apps/web build
```

## Acceptance Evidence

- Cloudflare's current build-image documentation lists `.node-version` as a
  supported Node.js selector and Node.js 22.16.0 as its current build release.
- Astro's installation prerequisites require Node.js 22.12.0 or newer and
  reject the Node.js 20.17.0 shown in the failed deployment log.
- `node --version`: reported `v22.16.0`, matching `.node-version`.
- The dependency upgrade selected TypeScript 7.0.2, outside the supported
  `^5.0.0 || ^6.0.0` peer range of `@astrojs/check@0.9.10` and the
  `^5.3.3 || ^6.0.0` peer range of `@astrojs/svelte@9.0.1`. This reproduced the
  Volar/Astro checker initialization crash locally. TypeScript is now pinned to
  `~6.0.3` in the manifest and lockfile.
- `astro-og-canvas@0.13.0` removed the `param` option and auto-detects the route
  parameter from `[...route].ts`; the obsolete option was removed from the OG
  route after the TypeScript fix allowed diagnostics to run.
- `bun install --frozen-lockfile`: passed and installed TypeScript 6.0.3 without
  rewriting the lockfile.
- `bun run --cwd apps/web astro -- check`: passed with zero diagnostics.
- `bun run --cwd apps/web build`: passed Astro check with zero diagnostics,
  generated 91 static pages, and generated all OG image routes under Node.js
  22.16.0 and TypeScript 6.0.3.
- `bunx moon run web:build`: local environment proof was blocked because the
  developer's proto installation has not installed the newly pinned release;
  direct Astro proof passed. Cloudflare platform selection remains pending the
  next deployment.
