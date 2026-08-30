# Haikel JavaScript and TypeScript Engineering Profile

This profile records the owner's demonstrated JavaScript and TypeScript working
style. Load it with `javascript-typescript.md`, then add the applicable framework
guide. Repository-local rules, contracts, and tooling take precedence.

The goal is code that is deliberately small, consistently formatted, type-safe at
boundaries, and easy to trace from a route or component to its owning behavior.

## 1. Non-Negotiable Quality Bar

- The agent MUST make the smallest complete change. Do not add compatibility
  layers, generic helpers, or dependencies without a current need.
- A change MUST have obvious ownership, input, output, error behavior, and side
  effects. Prefer straightforward code over compressed or clever code.
- Preserve stable contracts and repository conventions. Improve a weak legacy
  pattern only in the changed area and only when it does not expand scope.
- Formatting is part of correctness. Use the repository formatter; never make
  hand-aligned whitespace edits that fight it.
- Formatting alone is not enough. Use intentional blank lines to expose the
  phases of a function instead of presenting correct code as one dense block.
- A file MUST have one clear responsibility. Keep route composition, UI,
  validation, remote data, and transport concerns at their natural boundaries.
- Comments MUST explain a constraint or decision that code cannot state. Remove
  stale comments and never leave commented-out implementation code.

## 2. Format, Imports, and Naming

When a repository uses Biome, its configuration is authoritative. The owner's
common TypeScript baseline is 2-space indentation, 80-column wrapping, double
quotes, semicolons, spaces in object braces, parenthesized arrow parameters, and
trailing commas where the syntax permits them.

```ts
export async function getPatient(
  patientId: string
): Promise<PatientResponse> {
  const response = await axiosClient.get(`/patients/${patientId}`);

  return response.data.data;
}
```

### Visual rhythm and semantic spacing

The owner prefers clean, spacious code whose execution phases are visible at a
glance. Prettier or Biome remains authoritative for indentation and wrapping,
but semantic blank lines remain an engineering decision.

- Separate authentication, parsing, normalization, validation, remote calls,
  error translation, state transformation, and response construction when they
  are distinct phases.
- Keep an awaited operation next to its error handling. Add breathing room after
  that block before starting the next concern.
- Keep related validation checks together. Do not add a blank line after every
  condition, assignment, or hook mechanically.
- Separate derived data from side effects and separate side effects from the
  final returned value or rendered branch.
- In React components, visually group hooks by purpose: inputs and context,
  local state, remote queries, derived values, callbacks, effects, then render
  guards and JSX. Do not interleave unrelated hooks and transformations.
- In services and route handlers, use the same visible sequence as the backend:
  read input, validate, authorize, execute, translate the result, return.
- In tests, group arrange, act, and assert sections with one blank line between
  them when the test contains more than a trivial assertion.
- Expand dense object literals, function calls, and callback bodies when their
  one-line form hides ownership or makes the surrounding block difficult to
  scan.
- Use one blank line per semantic boundary. Avoid repeated blank lines, blank
  lines immediately inside braces, and whitespace that splits one operation
  from its directly associated error handling.

Preferred service rhythm:

```ts
export async function updatePatient(
  patientId: string,
  input: UpdatePatientInput
): Promise<Patient> {
  const payload = updatePatientSchema.parse(input);

  const response = await axiosClient.patch(
    `/patients/${patientId}`,
    payload
  );

  return response.data.data;
}
```

For broad cleanup, inspect representative routes, services, components, hooks,
and tests after the formatter runs. A clean formatter result does not by itself
prove that the code has the intended visual rhythm.

- Use `kebab-case` filenames, `PascalCase` component/type/class names, and
  `camelCase` values, functions, hooks, and handlers.
- Use a specific noun or verb. Avoid vague names such as `data`, `item`,
  `helper`, and `manager` when the domain supplies a better name.
- Keep imports organized mechanically. Use the repository alias for
  cross-feature application imports and relative imports for neighboring files.
- Use `import type` for type-only imports when supported by the project's module
  configuration.
- Next route files may default-export because the framework requires it. Reusable
  components SHOULD use named exports.

## 3. Type Boundaries and Data Contracts

- TypeScript MUST be the default for application code in a TypeScript project.
- Enable and preserve strict compiler settings. Never weaken compiler options or
  introduce `any` to silence an error.
- Treat network responses, route input, browser storage, environment values, and
  persisted JSON as `unknown` until runtime validation proves their shape.
- Give service functions typed request and response contracts. Export named
  domain types when a shape crosses a module boundary.
- Infer form values from their validation schema to keep the UI and validation
  contract synchronized.
- Use `undefined` for absence and `null` only when a contract intentionally
  represents an explicit empty value. Do not blur the two states.
- A cast must follow runtime validation or a documented invariant. Non-null
  assertions are not a substitute for control flow.

```ts
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginInput = z.infer<typeof loginSchema>;
```

## 4. Next.js and React Structure

- Keep App Router `page.tsx` files thin: metadata, layout composition, feature
  entry point, and only the `Suspense` boundary the route requires.
- Feature components own feature composition. Reusable primitives live in the
  shared UI area; do not duplicate an existing primitive for cosmetic reasons.
- Add `"use client"` only when hooks, browser APIs, interactive event handlers,
  Jotai, or React Query require it. Keep data-independent layout server-rendered.
- Prefer local `useState` for ephemeral local state, URL state for shareable
  filters and pagination, Jotai for cross-component client UI state, and React
  Query for remote/server state. Do not mirror fetched data into Jotai.
- Use React Hook Form, Zod, and the established field primitives for forms. Keep
  schema definitions outside components when they are reusable.
- Use semantic design tokens and existing Tailwind/shadcn primitives. Do not add
  CSS-in-JS or CSS modules to a Tailwind-based application without a technical
  need.

## 5. Remote Data and Mutations

HTTP access belongs in a typed service layer, never inside a component body.

```ts
export async function createPatient(
  input: CreatePatientInput
): Promise<Patient> {
  try {
    const response = await axiosClient.post("/patients", input);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.data?.message ?? "Unable to create patient"
      );
    }
    throw error;
  }
}
```

- Service functions MUST accept typed input, call their dedicated endpoint, and
  return domain data rather than an Axios response.
- Preserve the backend envelope at the boundary and unwrap it once. Components
  MUST NOT know transport nesting or Axios error shapes.
- Use stable, resource-prefixed React Query keys, for example
  `["patients", { page, limit, search, sort }]`.
- Invalidate only the query keys affected by a successful mutation. Broad cache
  invalidation is a legacy fallback, not a default.
- Keep mutation side effects in `onSuccess` and error feedback in `onError`.
  Provide user-facing success/failure feedback through the established toast
  mechanism.
- Use `placeholderData: keepPreviousData` for paginated views where retaining
  the previous page avoids disruptive UI jumps.

## 6. API and Backend TypeScript Style

For NestJS services, use a controller → service → persistence/model flow.

- Controllers own decorators, authentication metadata, request extraction,
  Swagger documentation, and response-envelope mapping.
- Services own business rules, authorization decisions, Prisma access, safe field
  selection, and domain response construction.
- DTOs MUST define the request/response contract and carry API documentation
  metadata where the project uses Swagger.
- Validate untrusted inputs at the application boundary. Use the established
  validation service and schema technology; do not validate scattered fragments
  of the same payload in multiple layers.
- Known business failures SHOULD use an explicit HTTP/domain error. A global
  error boundary should normalize it; controllers MUST NOT manually serialize
  every failure.
- Prisma queries that return user records MUST select safe fields deliberately.
  Never leak credentials by spreading a persistence record into a response.

## 7. Errors, Observability, and Security

- Catch errors only to recover, translate, clean up, or report at an owned
  boundary. Rethrow unknown failures unchanged after safe narrowing.
- Never branch on human-readable error text. Use a status, code, or typed
  discriminant.
- Do not log tokens, cookies, credentials, full request objects, medical data,
  or raw environment configuration.
- Public failures MUST be actionable but never expose stack traces, Prisma
  details, local paths, or third-party internals.
- Check authorization and ownership at the service boundary. An authenticated
  request is not automatically allowed to act on every resource.

## 8. Testing and Verification

- Test observable behavior and domain rules, not implementation trivia.
- Frontend tests SHOULD use Vitest and React Testing Library, query elements by
  accessible role/text, and wrap components in the same provider boundaries they
  need in production.
- Mock HTTP and external integrations at their module boundary. Do not mock the
  component or service being tested.
- Configure query-client tests with retries and background refetches disabled so
  failure behavior remains deterministic.
- Backend unit tests SHOULD construct a Nest testing module with focused
  dependency fakes and assert success plus meaningful error paths.
- Every behavior change needs focused success, invalid-input/boundary, and error
  coverage where tests exist. A defect fix SHOULD add a regression test.
- Before finishing, run the repository formatter, narrow tests, type/lint checks,
  relevant build, and inspect the final diff.

## 9. Legacy Patterns to Avoid Extending

- Do not copy permissive `any` usage merely because older lint configuration
  permits it. New code should use precise types or `unknown` at a boundary.
- Do not create a new `QueryClient` on every provider render; initialize it with
  stable provider lifetime.
- Do not use query keys made only of page/filter values; include the resource.
- Do not add controller business logic, oversized catch-all services, raw
  `require` calls, or duplicated middleware registration.
- Do not treat shallow tests that only assert a provider exists as adequate
  coverage for new behavior.
