# Validation

## Proof Strategy

Confirm the pinned release satisfies Astro's minimum, verify Cloudflare
documents `.node-version` as a supported selector, and run the existing static
production build. The next Cloudflare build is the final platform proof.

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit | Not applicable; declarative runtime file |
| Integration | Astro check and static production build under a supported Node release |
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
bun run --cwd apps/web build
```

## Acceptance Evidence

- Cloudflare's current build-image documentation lists `.node-version` as a
  supported Node.js selector and Node.js 22.16.0 as its current build release.
- Astro's installation prerequisites require Node.js 22.12.0 or newer and
  reject the Node.js 20.17.0 shown in the failed deployment log.
- `node --version`: reported `v22.16.0`, matching `.node-version`.
- `bun run --cwd apps/web build`: passed Astro check with zero diagnostics and
  generated 91 static pages under Node.js 22.16.0.
- `bunx moon run web:build`: local environment proof was blocked because the
  developer's proto installation has not installed the newly pinned release;
  direct Astro proof passed. Cloudflare platform selection remains pending the
  next deployment.
