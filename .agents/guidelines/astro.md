# Astro Coding-Agent Guideline

This guide covers Astro rendering, routing, content, islands, integrations, and
static deployment. Precedence follows `general.md` §2. Where
`haikel-javascript-typescript.md` disagrees with this guide, the profile wins,
except for the two Astro exceptions below.

Astro exceptions to the profile:

- Astro repositories keep Biome with `lineWidth: 100`, double quotes, and
  semicolons instead of the Prettier 80-column default.
- In `.astro` files, declare props as `type Props = { readonly ... }` so
  `Astro.props` infers them. The `<Component>Props` naming applies to TSX and
  Svelte components.

## 1. Discover the Actual Application

Before editing, the agent **MUST** establish the application that exists rather
than assuming current Astro defaults:

1. Read applicable instruction files, every relevant `package.json`, the
   lockfile, workspace configuration, `astro.config.*`, TypeScript
   configuration, content configuration, lint/format/test configuration,
   container files, and deployment entry points. Never inspect populated secret
   files merely to discover configuration.
2. Determine the installed Astro major version, package manager, JavaScript
   runtime, UI integrations, adapter, output mode, image service, CSS tooling,
   and content APIs from manifests and configuration.
3. Determine whether the application is standalone or part of a monorepo, and
   identify which package owns routes, shared UI, content, public assets, and
   deployment output.
4. Inspect neighboring pages, layouts, components, collections, middleware,
   endpoints, tests, and import aliases before choosing placement.
5. Trace the rendering phase of affected code: build time, request time, server
   island execution, or browser hydration. Do not infer a phase from the file
   extension alone.
6. Check version-matched official documentation before using an API whose
   behavior changed across Astro versions, especially content loaders, actions,
   sessions, server islands, environment schemas, routing, and adapters.

The agent **MUST NOT** silently upgrade Astro, an adapter, an integration, the
runtime, or the package manager as part of unrelated work.

## 2. Choose Rendering and Output Deliberately

Astro supports multiple rendering models. The configured mode is an
architecture and deployment contract, not a build detail.

### Static output

Use static output when routes can be generated ahead of time and deployed as
files.

- Dynamic routes **MUST** enumerate valid pages with `getStaticPaths()`.
- Data fetched in frontmatter is build-time data. Its freshness lasts until the
  next build unless browser code refreshes it.
- Required build-time services **MUST** be available in CI, or the build needs a
  deliberate cache, snapshot, or fallback policy.
- Unknown routes **MUST** be served with the generated 404 document and an HTTP
  404 status. A homepage fallback with status 200 is SPA behavior and is
  incorrect for a multi-page static site unless explicitly required.

### On-demand output

Use server output or on-demand rendering only when a request-time requirement
justifies a runtime server or serverless adapter.

- The adapter **MUST** match the deployment platform and installed Astro
  version.
- Request-only APIs, cookies, sessions, authorization, middleware, and runtime
  secrets **MUST** remain in server-executed modules.
- Every request path **MUST** have bounded external I/O, explicit failure
  behavior, and observability appropriate to the host.
- Runtime deployment **MUST** handle signals, shutdown, health, writable paths,
  and scaling semantics required by its adapter.

### Mixed prerendered and on-demand routes

- Route-level prerendering choices **MUST** be explicit and supported by the
  installed version and output mode.
- A route **MUST NOT** be changed from prerendered to on-demand merely to avoid
  designing a correct build-time data policy.
- A route **MUST NOT** be prerendered when its response depends on per-request
  identity, authorization, non-public cookies, or secrets.
- Tests **MUST** cover both prerendered and on-demand routes when an application
  uses both.

## 3. Project Structure and Ownership

Use Astro's filesystem conventions as ownership boundaries:

- `src/pages` owns public routes, route parameters, static path generation, and
  page-level composition.
- `src/layouts` owns reusable document or page shells.
- `src/components` owns reusable presentation and interactive islands.
- `src/content.config.*` owns content collection loaders and schemas.
- `src/content` or configured loader sources own authored content.
- `src/middleware.*` owns cross-route request policy when middleware is actually
  required.
- `src/actions` or the version-appropriate action location owns typed server
  actions.
- `public` owns files that must be copied byte-for-byte and addressed by stable
  public paths.
- Source-controlled images, fonts, and other transformable assets SHOULD live
  under `src` and flow through Astro's asset pipeline.

Additional rules:

- Pages **SHOULD** stay thin: load route data, establish metadata, and compose
  layouts and components.
- Shared presentation **MUST NOT** be duplicated across route files when one
  component or layout owns it clearly.
- A component **MUST NOT** become a catch-all page shell merely to reduce the
  number of files.
- Shared workspace packages **MUST** expose intentional public APIs. Do not
  import another package's private source unless that is an established
  workspace contract.
- Path aliases **MUST** agree across TypeScript, Vite, test tools, and editor
  configuration.

## 4. File-Based Routing

- Route file names and directory placement **MUST** express the intended URL.
- Dynamic parameters **MUST** be validated before use. A path segment is
  untrusted input in on-demand rendering.
- Rest parameters **MUST** have documented normalization for leading slashes,
  trailing slashes, empty values, encoding, and nested segments.
- Static `getStaticPaths()` entries **MUST** be deterministic and unique.
- `params` values returned by `getStaticPaths()` **MUST** match the route's
  dynamic segment names and supported value types.
- Large static route sets SHOULD avoid repeated full-dataset fetches. Fetch and
  normalize once, then derive path entries and props.
- Redirects and rewrites **MUST** preserve locale, query, and status semantics.
- Route collisions between static files, dynamic files, endpoints, and
  integrations **MUST** be checked during build.
- URL generation SHOULD use `Astro.site`, `Astro.url`, and the platform URL API
  rather than string concatenation.
- Trailing-slash behavior **MUST** align with Astro configuration, canonical
  URLs, internal links, and the production host.

When several locales share a route shape, prefer one typed route definition or
route-generation helper over manually duplicated path logic. Duplication is
acceptable only when locale pages genuinely differ in composition.

## 5. `.astro` Component Boundaries

An Astro component has a server-executed frontmatter section and a rendered
template. Keep that boundary visible.

### Frontmatter

- Frontmatter SHOULD parse props, load required data, derive view models, and
  prepare serializable template values.
- External values **MUST** be validated before the template consumes them.
- Side effects **MUST NOT** occur merely because a presentation component
  renders.
- Expensive work **MUST NOT** be repeated in each component instance when it can
  be performed once by the owning page or data module.
- Browser globals such as `window`, `document`, and `localStorage` **MUST NOT**
  be accessed during frontmatter execution.

### Template

- Prefer semantic HTML and Astro components for static content.
- Props **MUST** have explicit types through `type Props`. Optional props
  **MUST** have deliberate defaults or explicit absent-state rendering.
- Slots SHOULD represent meaningful composition points, not hidden control
  channels.
- Inline scripts and styles SHOULD be used only when their ownership is local
  and their bundling behavior is understood.
- Template expressions SHOULD remain simple. Move non-trivial filtering,
  sorting, mapping, and policy into named typed functions or frontmatter.
- Framework components without a `client:*` directive render as static output;
  use that behavior intentionally.

The same component **MUST NOT** conceal unrelated data access, metadata policy,
analytics, and presentation merely because Astro permits all of them in one
file.

## 6. Server, Build, and Browser Isolation

- Code that imports secrets, filesystem APIs, private SDKs, or server-only
  dependencies **MUST** remain unreachable from client bundles.
- Public environment values **MUST** use the version-appropriate public prefix
  and be safe to expose. A public prefix is an exposure declaration, not only a
  naming convention.
- Declare environment variables in `env.schema` with `envField` in the Astro
  config and import them from `astro:env/server` or `astro:env/client`.
  Declare secrets with `access: "secret"` and read them only from
  `astro:env/server`. Casting `import.meta.env.X as string` is not validation.
- Optional integrations such as analytics SHOULD disable themselves cleanly
  when optional configuration is absent.
- Server-only modules SHOULD use a naming or directory convention that makes
  accidental browser imports obvious.
- Values passed to hydrated components **MUST** be serializable by Astro's
  supported prop transport. Pass minimal view data rather than server clients,
  rich class instances, or entire API envelopes.
- Secret values **MUST NOT** enter page HTML, hydration payloads, source maps,
  public files, client logs, or build arguments.

## 7. Islands and Hydration Directives

Astro's default is zero client JavaScript. Every hydration directive spends
performance, resilience, and complexity budget.

### Directive selection

- No directive: use for static framework-rendered markup.
- `client:load`: use only when interaction must be ready immediately after page
  load, such as primary navigation that cannot work without JavaScript.
- `client:idle`: use for non-critical interaction that can wait until the main
  thread is idle.
- `client:visible`: use for below-the-fold or expensive islands that need to
  hydrate only near the viewport.
- `client:media`: use when the component is interactive only under a specific
  media condition.
- `client:only`: use only when server rendering is impossible because the
  component fundamentally requires a browser environment during render.

### Required discipline

- The agent **MUST** justify each newly hydrated island.
- Prefer the least eager directive that preserves the user experience.
- `client:only` **MUST** have a meaningful fallback when its absence would leave
  a blank or confusing page.
- Substantive page content **SHOULD** exist in initial HTML. Hidden duplicate
  headings or crawler-only text are not substitutes for rendered content.
- Whole-page islands SHOULD be decomposed into static Astro content and the
  smallest coherent interactive roots.
- An island **MUST** clean up event listeners, observers, timers, subscriptions,
  and pending requests according to its framework lifecycle.
- Browser persistence **MUST** be read after the browser boundary is established
  and reconciled without a disruptive flash where practical.
- Networked islands **MUST** model loading, empty, success, and error states and
  cancel obsolete requests when the framework supports cancellation.
- Hydration failures SHOULD leave readable content and functional links or
  forms whenever progressive enhancement is possible.

## 8. React, Svelte, Vue, and Other UI Integrations

Each hydrated framework component is a separate application root.

- Context, stores, dependency injection, error boundaries, and framework event
  propagation **DO NOT** cross separate island roots.
- A provider and every consumer that requires it **MUST** live inside one island
  shell, or use an explicit cross-island communication mechanism.
- Do not wrap every island with every global provider. Include only providers
  used by that root.
- Shared application state across islands requires a deliberate browser-level
  store, custom events, URL state, or another explicit protocol. It **MUST NOT**
  depend on accidental framework behavior.
- Astro components cannot be imported into a client framework component as if
  they were framework-native components. Use slots or a supported composition
  boundary.
- Framework-specific UI primitives SHOULD remain in their framework package;
  static wrappers and route composition SHOULD remain in Astro.
- Do not mix multiple UI frameworks without a measured benefit that outweighs
  duplicate runtimes and mental overhead.

## 9. Content Collections and Authored Content

Content collections are executable content contracts. Define them in
`src/content.config.ts` with a loader and a schema:

```ts
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const notes = defineCollection({
  loader: glob({ base: "./src/content/notes", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    createdAt: z.date(),
    tags: z.array(z.string().min(1)),
    title: z.string().min(1),
  }),
});

export const collections = { notes };
```

- Every collection **MUST** have a loader and schema.
- Schemas **MUST** validate semantics, not merely primitive shape:
  - URLs require URL and protocol rules.
  - Dates require a parseable representation and timezone policy.
  - IDs and slugs require uniqueness and format constraints.
  - Enums require finite values.
  - Optional booleans SHOULD have explicit defaults when absence has a standard
    meaning.
- Collection identity **MUST** be stable. Do not mix filename identity,
  frontmatter IDs, and CMS IDs without a documented mapping.
- Lists, detail pages, feeds, tags, sitemaps, and social images SHOULD derive
  from the same validated records rather than duplicate constants.
- Tag and category logic **MUST** preserve whole values. Never join and split
  tags through whitespace.
- Sorting **MUST** be deterministic, including tie-breaking.
- Draft, scheduled, private, and missing-detail content policies **MUST** be
  explicit and tested.
- Content image alternatives SHOULD describe the image's purpose. Placeholder
  labels such as `image`, `thumbnail`, or `screenshot 1` are insufficient.
- MDX component imports SHOULD form a small documented authoring API. Content
  files **MUST NOT** depend on arbitrary private implementation modules.

Schema changes can invalidate all content during a build. Update content and
schema coherently and run the complete content build.

## 10. External Data and CMS Boundaries

First decide when data is fetched:

| Fetch phase | Freshness | Failure impact | Appropriate use |
| --- | --- | --- | --- |
| Build time | Until next build | Can block deployment | Public content suitable for static generation |
| Request time | Per request or cache | Affects live requests | Personalized or frequently changing server data |
| Browser time | Per client | Affects one browser | User-specific or progressively enhanced data |

Rules:

- External responses **MUST** enter as `unknown` and be schema-validated before
  mapping to domain or view models.
- Requests **MUST** have bounded timeouts. Retries **MUST** be bounded,
  idempotency-aware, and limited to failures likely to recover.
- Locale, publication state, tenant, and authorization filters **MUST** be
  applied by the data source query where they are contract requirements.
- List and detail lookup **MUST** use consistent filters and identity rules.
- Server and browser clients SHOULD share schemas and normalization rules rather
  than drift into validated and unvalidated implementations.
- The application **MUST** choose whether unavailable or malformed data fails
  the build, publishes a visible fallback, or uses a verified cached snapshot.
  Silent empty output is not a neutral choice.
- Schema failures and fallbacks **MUST** be observable without logging secrets or
  personal data.
- Build-time credentials **MUST** use CI secret stores and BuildKit secret mounts
  where applicable, never public environment variables or Docker build args.
- Data that changes without a rebuild **MUST NOT** be described to users as live.

## 11. Endpoints, Actions, Middleware, and Forms

- Use Astro endpoints for explicit HTTP resources and webhooks, and typed
  actions for supported form or RPC-style mutations when they simplify the
  contract.
- Validate params, query strings, headers, cookies, and bodies at the boundary.
- Authentication proves identity; authorization **MUST** be enforced separately
  at every protected effect.
- Mutations **MUST** define CSRF policy, idempotency, rate limits, and error
  behavior appropriate to the endpoint.
- Forms **MUST** have a real submission path before displaying success.
- Prefer progressively enhanced native forms when the workflow can work without
  client JavaScript.
- Pending state **MUST** prevent accidental duplicate submission without making
  recovery impossible.
- Field errors SHOULD be associated with controls, summarized when useful, and
  preserved across server validation failures.
- Middleware **MUST** be reserved for truly cross-cutting request policy. Do not
  hide route-specific data access or business behavior in middleware.
- Middleware order and matcher scope **MUST** be deliberate and tested.
- Endpoint status codes, content types, cache headers, and error envelopes are
  public contracts.

## 12. Layouts, Metadata, and Search Discovery

A shared document layout SHOULD own cross-cutting document concerns:

- `<html lang>` and text direction.
- Charset and viewport metadata.
- Page title and description.
- Canonical URL.
- Open Graph and social card metadata.
- Favicon and web manifest links.
- Fonts and global styles.
- Skip link, navigation, main landmark, and footer.
- Optional analytics with safe configuration behavior.

Additional requirements:

- Configure `site` and derive absolute canonical, sitemap, feed, social image,
  and structured-data URLs from one source of truth.
- Every indexable page **MUST** have one self-consistent canonical URL.
- Error, preview, draft, and other non-indexable routes **MUST** emit an explicit
  robots policy.
- Structured data **MUST** describe real visible content and real product
  capabilities. Do not advertise search, ratings, inventory, or actions the
  application does not provide.
- Data serialized into inline JSON **MUST** be escaped safely for HTML context.
- Use one sitemap ownership path unless several sitemap indexes are intentional.
- Feeds, sitemaps, and social-image routes **MUST** include the same eligible
  public records as the corresponding pages.
- Resource hints and preloads SHOULD be page-specific. Do not preload a homepage
  image or preconnect to an API on unrelated routes.

## 13. Internationalization and Localized Routing

- Supported locales, default locale, prefix strategy, and fallback locale
  **MUST** be explicit.
- Locale should be derived from the route or framework i18n context, not from
  mutable browser state when rendering a static route.
- Canonical and alternate-language URLs **MUST** come from one locale-aware route
  map.
- Internal navigation, breadcrumbs, pagination, forms, error recovery links,
  feeds, and sitemaps **MUST** preserve locale.
- CMS list and detail queries **MUST** filter by locale. Include locale in cache
  keys and uniqueness assumptions where records can share slugs.
- `<html lang>`, Open Graph locale, structured data, and feed metadata **MUST**
  reflect the content language.
- Inline language changes SHOULD use `lang`; right-to-left content SHOULD also
  use the correct `dir` boundary.
- Translation dictionaries SHOULD be typed and shared across Astro and hydrated
  framework components when both render the same interface vocabulary.
- Localized page duplication SHOULD be generated or composed from shared route
  definitions when possible. Tests MUST detect missing locale counterparts and
  wrong-language links.

## 14. Images, Fonts, and Public Assets

- Prefer Astro's image pipeline for source-controlled images that benefit from
  dimensions, responsive variants, modern formats, and optimization.
- Every content image **MUST** declare intrinsic dimensions or otherwise reserve
  stable layout space.
- Responsive images SHOULD use accurate `sizes`, not a generic viewport-wide
  assumption.
- Above-the-fold priority images may load eagerly; below-the-fold images SHOULD
  load lazily.
- Remote image sources **MUST** be allowlisted and validated according to the
  installed image-service configuration.
- Image fit (`cover`, `contain`, or natural sizing) **MUST** match content intent;
  do not distort images with fill behavior.
- Decorative images **MUST** use empty alternative text. Informative images
  **MUST** have meaningful alternatives.
- Load fonts through the Fonts API: declare them in the config `fonts` array
  with a provider such as `fontProviders.fontsource()` and a `cssVariable`,
  then render `<Font cssVariable="..." />` from `astro:assets` in the layout.
  Preload only the fonts used above the fold.
- `public` files **MUST** have content matching their extension and declared MIME
  type.
- Large media, duplicate images, and unused font weights SHOULD be identified
  before adding new assets.

## 15. Styling and Accessibility

- Use the repository's styling system and semantic tokens. Tailwind source
  scanning **MUST** include shared workspace UI packages, and finite variants
  use explicit class maps instead of constructed class names.
- Follow `preferences.md` for interface and accessibility quality. Content and
  navigation SHOULD remain usable when hydration is delayed or fails.

## 16. Rich Content and Security

Astro escapes normal template expressions, but `set:html` and rich-content
renderers bypass that protection.

- Untrusted HTML **MUST** be sanitized with an allowlist immediately before it
  reaches `set:html`.
- Markdown pipelines that permit raw HTML **MUST** sanitize the rendered result
  unless every author is fully trusted and account compromise is accepted as a
  publishing threat.
- Rich-text conversion **MUST** escape text and attributes, constrain heading
  levels, validate URL schemes, and allowlist iframe/embed hosts.
- `javascript:` URLs, event-handler attributes, unsafe SVG, and unrestricted
  style attributes **MUST** be rejected.
- Content Security Policy SHOULD be tested against the built site. Prefer
  hashes, nonces, or external files over broad `unsafe-inline` allowances.
- Third-party analytics, embeds, comments, and forms **MUST** be assessed for
  privacy, consent, integrity, and failure behavior.
- Source maps and monitoring uploads **MUST NOT** expose source or secrets
  publicly by accident.

## 17. Errors, Not Found, and Failure Semantics

- Provide intentional `404` and `500` experiences where supported by the output
  and adapter.
- A missing resource **MUST** return the corresponding HTTP error status. A
  friendly body with status 200 is still incorrect.
- Error pages **MUST** avoid leaking stack traces, internal paths, query details,
  tokens, or personal data.
- Recovery links **MUST** preserve locale where applicable.
- Static-host and container tests **MUST** verify the actual status and content
  served for unknown paths, not only the generated file's existence.
- Build-time fallback content SHOULD identify stale or unavailable sections when
  hiding the failure would mislead users.
- Empty states **MUST** distinguish a legitimate empty dataset from a failed
  fetch when that distinction changes user decisions.

## 18. Performance, Caching, and Compression

- The first performance strategy is less client JavaScript. Measure island
  count, bundle weight, and hydration timing before adding optimization layers.
- Avoid hydrating static layout, prose, lists, and images merely because a UI
  framework component already exists.
- Fetch independent build-time data concurrently when doing so respects service
  limits and deterministic failure behavior.
- Use one compression path. Do not add precompression integrations such as
  `astro-compressor` unless the production server or CDN negotiates
  `Accept-Encoding`, serves the `.br`/`.gz` files with `Content-Encoding`, and
  varies caches correctly.
- Hashed assets SHOULD receive long-lived immutable caching.
- HTML caching **MUST** match deployment freshness and rollback behavior.
- Public content without fingerprinted paths SHOULD use shorter or revalidated
  caching.
- Do not combine origin and CDN compression or caching rules without checking
  for duplicate work and stale behavior.
- Lighthouse or synthetic budgets SHOULD cover representative route classes and
  enforce thresholds rather than collect unused reports.

## 19. Testing and Verification

Verification MUST follow the repository's package manager and declared scripts.
At minimum, run the smallest applicable set of:

1. Formatter or formatting check.
2. Linter.
3. `astro check` and TypeScript checking.
4. Focused unit or component tests.
5. Full production build.
6. Browser tests against the built output or production adapter.

### Required coverage by change type

- Route changes: path generation, params, links, canonical, status, and locale.
- Content changes: schema, eligible records, sorting, tags, feeds, sitemap, and
  build success.
- Island changes: initial HTML, hydration, keyboard behavior, loading/error
  states, cleanup, and no-JavaScript fallback where applicable.
- CMS changes: valid data, malformed data, timeout, unavailable service, locale,
  publication state, and fallback observability.
- Metadata changes: canonical, alternate links, robots, social cards, and valid
  structured data.
- Styling changes: mobile through wide viewport, zoom, long text, reduced
  motion, focus visibility, and layout shift.
- Deployment changes: container build, non-root runtime, health, unknown-route
  status, compression, cache headers, and shutdown.

Tests SHOULD exercise the built artifact. A development server does not prove
that static files, adapter output, environment replacement, custom errors,
headers, or compression work in production.

Build and check commands SHOULD be non-mutating. Do not run a writing formatter
as part of a build script.

## 20. Docker and Static Serving

Apply `docker.md` in addition to this section. Use the repository's package
manager in Docker; for Bun see `docker.md`.

- Static sites SHOULD use a multi-stage build and copy only the generated output
  plus required runtime files into the final image.
- Dependency installation **MUST** use the committed lockfile in frozen mode.
- Build credentials **MUST** use BuildKit secret mounts and **MUST NOT** persist
  in layers, image history, runtime environment, or generated files.
- The runtime SHOULD be non-root, minimal, read-only where practical, and free
  of compilers and package managers.
- A custom static server **MUST** provide:
  - path traversal and dotfile protection;
  - correct MIME types;
  - clean URL and directory-index behavior matching generated output;
  - custom 404 content with status 404;
  - immutable caching for fingerprinted assets;
  - deliberate HTML caching;
  - precompressed content negotiation when such files are generated;
  - baseline security headers;
  - explicit read, header, write, and idle timeouts;
  - graceful shutdown;
  - a lightweight health endpoint or health subcommand.
- Define the health check in one place. Under Compose or Dokploy, the compose
  `healthcheck` owns it and the Dockerfile omits `HEALTHCHECK`.
- Container verification **MUST** request a real route, a hashed asset, the
  health endpoint, a missing route, and each supported content encoding.
