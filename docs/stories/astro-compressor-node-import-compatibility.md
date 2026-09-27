# Keep the Astro compressor compatible with the pinned Node runtime

## Status

implemented

## Lane

normal

## Product Contract

The Astro build integrations must load under the Node version pinned by the
repository and used by the deployment workflow.

## Relevant Product Docs

- `docs/product/website.md`
- `docs/ARCHITECTURE.md`

## Acceptance Criteria

- The compressor package's declared Node engine includes Node 22.
- The app can import its Astro compressor integration under the pinned Node
  runtime.
- The existing static build and web tests remain functional.

## Design Notes

- Preserve the repository's Node 22 deployment contract; do not upgrade the
  runtime solely to accommodate an unnecessary build-tool major version.
- Change only the `astro-compressor` dependency and its lockfile resolution.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Direct Node 22 module import succeeds. |
| Integration | Astro config loads and static build succeeds. |
| E2E | Existing web Cypress suite passes. |
| Platform | Not applicable. |
| Release | Not applicable. |

## Harness Delta

No harness changes required.

## Evidence

| Check | Command or artifact | Outcome |
| --- | --- | --- |
| Regression reproduction before fix | `/Users/mac/.vite-plus/js_runtime/node/22.16.0/bin/node --input-type=module -e 'await import("astro-compressor")'` from `apps/web` | Failed with `ERR_INVALID_MODULE_SPECIFIER: Invalid module "#/compressor.js"`, matching the report. |
| Regression reproduction after fix | Same command after resolving `astro-compressor@1.3.0` | Passed. v1.3.0 declares Node `>=22`, matching `.node-version`; v2.0.1 declares `>=24`. |
| Static build | Direct Node 22 Astro build with Sentry auth token empty | Passed; 97 static pages built and compressor processed output. No source-map upload was performed. |
| Cypress | `bunx cypress run --project apps/web --spec apps/web/cypress/e2e/collection-lists.cy.ts,apps/web/cypress/e2e/responsive-review.cy.ts --config baseUrl=http://127.0.0.1:3001` | Passed, 16/16. |
| Browser smoke | Playwright on `/` and `/works` at 1280×900 | Both returned HTTP 200 with correct titles, visible project sections, zero page errors, and zero failed responses. |
| Standard repository build | `bun run build` | Still blocked before Astro build by the pre-existing Astro checker / TypeScript 7 incompatibility. |
