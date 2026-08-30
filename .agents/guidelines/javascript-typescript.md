# JavaScript and TypeScript Coding-Agent Guideline

This document defines a standalone language-level baseline for writing and
changing JavaScript and TypeScript. Local repository instructions and existing
tool configuration take precedence where they are more specific.

The terms **MUST**, **SHOULD**, and **AVOID** are normative.

## 1. Engineering Principles

- Code MUST make ownership, data flow, and side effects easy to identify.
- Correctness and clarity MUST take priority over brevity or cleverness.
- Changes MUST be as small as possible while fully satisfying the requirement.
- Existing public behavior MUST remain stable unless the requirement explicitly
  changes it.
- Abstractions MUST remove demonstrated complexity or meaningful duplication.
- Code SHOULD use the language and standard library before adding a dependency.
- Comments SHOULD explain constraints, intent, or non-obvious tradeoffs. They
  MUST NOT narrate syntax or preserve dead code.
- An optimization MUST be supported by measurement or a known constraint.

## 2. Coding-Agent Workflow

### 2.1 Before Editing

The agent MUST:

1. Read all applicable instruction files.
2. Inspect `package.json`, the lockfile, compiler configuration, formatter and
   linter configuration, test configuration, and relevant source files.
3. Identify the package manager and supported runtime versions.
4. Find the module that owns the behavior and inspect its callers, tests,
   exported types, and boundary adapters.
5. Reproduce a reported defect or establish the failing path before claiming a
   root cause.
6. Separate verified facts from assumptions.
7. Check the working tree and preserve unrelated user changes.

### 2.2 While Editing

- The agent MUST follow established repository conventions when they do not
  conflict with correctness or this document.
- The agent MUST update every affected caller, test, and contract when changing
  a signature or exported value.
- The agent SHOULD add or change tests with the implementation.
- The agent MUST NOT reformat unrelated files, perform speculative refactors,
  or replace tooling without a requirement.
- Generated files MUST be produced by their generator, not hand-edited.
- Suppressions MUST be narrow, justified, and placed at the smallest possible
  scope.

### 2.3 Before Finishing

The agent MUST:

1. Format changed files with the repository's formatter.
2. Run focused tests, static analysis, and type-checking.
3. Run broader tests and the package build when the change can affect package
   integration or emitted output.
4. Inspect the final diff for accidental API changes, debug output, secrets,
   generated artifacts, and unrelated edits.
5. Report the exact checks run, their results, and anything not verified.

## 3. JavaScript Versus TypeScript

- New application and library source SHOULD use TypeScript when the repository
  supports it.
- Existing JavaScript MUST NOT be converted wholesale merely because one file
  needs a change.
- JavaScript is appropriate for small scripts, configuration files required to
  be JavaScript, and repositories intentionally maintained as JavaScript.
- JavaScript MUST use the same runtime-validation, error-handling, testing, and
  module-design standards as TypeScript.
- Typed JavaScript SHOULD use checked JSDoc where migrating to TypeScript is not
  practical.
- File extensions MUST reflect actual syntax and runtime behavior:
  - `.ts` for TypeScript without JSX syntax.
  - `.tsx` only when JSX syntax is present.
  - `.js`, `.mjs`, or `.cjs` according to the repository's module mode.
  - `.d.ts` only for declarations, ambient types, or deliberate type shims.
- The agent MUST NOT introduce TypeScript syntax into files executed directly
  as JavaScript.
- A package MUST use one deliberate module system. Mixed module systems require
  an explicit interoperability boundary.

## 4. Compiler and Language Strictness

New TypeScript configurations MUST enable `strict`. They SHOULD also enable the
strictest options compatible with the runtime and package design, including:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "useUnknownInCatchVariables": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true
  }
}
```

- Existing strictness MUST NOT be weakened to make an error disappear.
- Compiler targets and libraries MUST match supported runtimes.
- Application type-checking SHOULD use `noEmit` when another tool emits code.
- Libraries MUST verify both emitted JavaScript and declarations when they
  publish either.
- Type errors MUST be fixed at their source. Broad exclusions, unchecked
  assertions, and blanket suppression directives are prohibited substitutes.
- `skipLibCheck` SHOULD be treated as a compatibility or performance choice,
  not proof that dependency declarations are correct.

## 5. Naming, Files, and Symbols

Follow repository convention. If no convention exists, use:

- Files and directories: `kebab-case`.
- Variables, functions, and methods: `camelCase`.
- Classes, type aliases, interfaces, and enums: `PascalCase`.
- Immutable module-level constants: `UPPER_SNAKE_CASE` only when they are true
  constants; otherwise use `camelCase`.
- Boolean values: names beginning with `is`, `has`, `can`, `should`, or another
  clear predicate.
- Identifiers: `id`, `userId`, and `requestId`; preserve external casing only at
  the boundary that requires it.

Additional rules:

- Names MUST describe purpose, not implementation trivia. Avoid `data`, `item`,
  `obj`, `util`, `helper`, and `manager` when a specific name is available.
- Functions SHOULD use verb phrases. Types and value objects SHOULD use noun
  phrases.
- Acronyms SHOULD be cased as words: `parseUrl`, `HttpClient`, `userId`.
- A file SHOULD have one clear responsibility. It may export multiple closely
  related symbols.
- Tests SHOULD be colocated or placed in the repository's established test
  location, with names traceable to the source behavior.
- Barrel files SHOULD be used only for intentional package boundaries. They
  MUST NOT hide cycles or export private implementation details.
- File names MUST NOT differ only by letter case.

## 6. Values, Variables, and Immutability

- Use `const` by default. Use `let` only when reassignment is necessary. Never
  use `var`.
- Prefer immutable transformations and new values over hidden mutation.
- Inputs MUST NOT be mutated unless mutation is the explicit documented
  contract.
- Shared mutable module state MUST be avoided. If required, its lifecycle,
  synchronization, and reset behavior MUST be explicit.
- Use `readonly` for data that consumers must not mutate. Deep immutability MUST
  be modeled deliberately; `readonly` is shallow.
- Use `as const` for stable literal values when narrow inference is intended.
- Equality checks MUST use `===` and `!==`, except for the deliberate
  `value == null` check when both `null` and `undefined` are intended.
- Nullish fallback MUST use `??` when valid values include `0`, `false`, or an
  empty string.
- Optional chaining SHOULD be used for genuinely optional traversal. It MUST
  NOT conceal a violated invariant.
- Numbers MUST be checked with `Number.isFinite`, `Number.isNaN`, or
  `Number.isInteger` as appropriate.
- Money, measurements, and timestamps MUST have explicit units and precision.
- Dates crossing a serialized boundary MUST be strings or numbers with a
  documented format; they are not `Date` instances until parsed.

## 7. Types and Inference

- Type external and untrusted values as `unknown` until validated.
- Allow inference for local values when it is precise and obvious.
- Exported functions SHOULD declare return types when the annotation protects a
  public contract or prevents accidental widening.
- Public data structures SHOULD have named types when the name communicates a
  domain concept.
- Optional properties MUST mean that the property may be absent. Nullable
  properties MUST mean that `null` is a valid explicit value. Do not interchange
  these states accidentally.
- `undefined` SHOULD represent absence in internal language-level APIs unless a
  contract requires `null`.
- `any` MUST NOT be used as an escape hatch. An unavoidable untyped dependency
  boundary MUST isolate it, document why, and expose `unknown` or a safe type.
- Type assertions MUST follow a runtime proof or an invariant the compiler
  cannot express. Assertions MUST NOT replace validation.
- Non-null assertions MUST be avoided. Prove the value exists with control flow
  or fail explicitly.
- Use `satisfies` to verify shape while preserving useful literal inference.
- Utility and mapped types SHOULD model real relationships. Deeply nested type
  transformations that obscure the resulting shape SHOULD be replaced with a
  named explicit type.
- Wrapper object types such as `String`, `Number`, and `Boolean` MUST NOT be
  used. Use `string`, `number`, and `boolean`.
- `object`, `{}`, and `Function` SHOULD NOT be used as vague stand-ins for an
  unknown shape or callable signature.

## 8. Unions, Generics, and Exhaustiveness

- Finite states MUST use literal unions or an equivalent closed representation.
- Distinct state shapes SHOULD use discriminated unions.
- Invalid combinations SHOULD be made unrepresentable instead of coordinated
  through several optional fields or booleans.
- Exhaustive branching SHOULD use a `never` check so newly added variants cause
  a compile-time failure.

```ts
type Result<T> =
  | { status: "success"; value: T }
  | { status: "failure"; error: Error };

function assertNever(value: never): never {
  throw new Error(`Unhandled variant: ${String(value)}`);
}
```

- Generics MUST represent a meaningful relationship between inputs, outputs,
  or members. A generic used once SHOULD usually be a concrete type or
  `unknown`.
- Generic parameters SHOULD have descriptive names when `T`, `K`, or `V` is
  insufficient.
- Constraints MUST be as narrow as required, not broader.
- Default generic arguments SHOULD be used only when the default is safe and
  unsurprising.
- Conditional types and overloads SHOULD be avoided when a union and normal
  control flow are clearer.
- Function overload implementations MUST accept and correctly narrow every
  declared overload.
- Numeric enums SHOULD be avoided because reverse mappings and arbitrary
  numeric values are often undesirable. Prefer literal values and unions.

## 9. Functions and Control Flow

- A function MUST have one coherent responsibility and a clear contract.
- Prefer pure functions for transformations and isolate side effects at named
  boundaries.
- Parameters SHOULD be few and meaningful. Use an options object when arguments
  are numerous, optional, or easy to confuse.
- Boolean positional arguments MUST be avoided. Use a named option or separate
  function.
- Defaults belong at the boundary where omission is meaningful.
- Return early for invalid input and exceptional branches. Keep the primary path
  easy to scan.
- Nested control flow SHOULD be reduced with guard clauses, extraction, or a
  clearer data model.
- Every code path MUST return a value consistent with the declared contract.
- Callbacks SHOULD be named when the name clarifies intent or aids diagnostics.
- Arrow functions SHOULD be used for callbacks and lexical `this`. Function
  declarations SHOULD be used for named operations when hoisting and stack
  readability are useful.
- `this`-dependent methods MUST NOT be passed unbound.
- Classes SHOULD be used only when identity, encapsulated mutable state, or
  polymorphic behavior justifies them. Prefer functions and plain objects for
  stateless behavior.
- Recursion MUST have an explicit termination condition and SHOULD account for
  runtime stack limits.

## 10. Objects and Collections

- Prefer plain objects for records and `Map` for dynamic keys or non-string
  keys. Prefer `Set` for membership and uniqueness.
- Own-property checks MUST use `Object.hasOwn` or an equivalent safe operation.
- Objects with untrusted keys MUST NOT be indexed without validation. Consider
  `Map` or a null-prototype object where prototype keys are a risk.
- Array methods SHOULD be used when they express the operation clearly. A loop
  is preferable when it improves control flow, avoids repeated work, or permits
  early exit.
- `for...in` MUST NOT be used for arrays.
- Sorting MUST use an explicit comparator for numbers and structured values.
  Code MUST NOT assume `sort()` is numerically ordered.
- Callers MUST NOT depend on object property order unless the language contract
  and API explicitly make that order meaningful.
- Spreading is shallow. Code MUST NOT treat object or array spread as a deep
  clone.
- Large collections SHOULD avoid repeated full scans in nested loops when an
  indexed structure gives clearer and bounded behavior.
- Sparse arrays SHOULD be avoided.
- Serialization MUST account for unsupported or transformed values such as
  `undefined`, `bigint`, non-finite numbers, symbols, functions, maps, sets,
  cycles, and date objects.

## 11. Asynchronous Code, Promises, and Cancellation

- Every promise MUST be awaited, returned, deliberately aggregated, or
  explicitly marked and handled as detached work.
- Detached work MUST define error reporting and lifecycle behavior. Prefixing a
  promise with `void` does not handle rejection.
- Use `async` and `await` for readable sequencing. Do not add `async` when a
  function can directly return the existing promise without changing behavior.
- Independent operations SHOULD run concurrently with `Promise.all`. Dependent
  operations MUST remain sequential.
- `Promise.allSettled` SHOULD be used only when partial completion is part of the
  contract and every result is inspected.
- Do not use `await` inside `forEach`. Use a loop for sequential work or map to
  promises and aggregate them for concurrent work.
- Concurrency MUST be bounded for large or untrusted workloads.
- Long-running, retryable, or external operations SHOULD accept an
  `AbortSignal` and propagate it through every supporting call.
- Cancellation MUST be distinguished from failure when callers need different
  behavior.
- Timeouts SHOULD be implemented with cancellation, and timeout resources MUST
  be cleaned up.
- Retries MUST be bounded, apply only to transient and safe operations, include
  backoff with jitter, and respect cancellation.
- Shared promises and caches MUST define rejection, invalidation, and concurrent
  access behavior.
- Promise constructors MUST NOT wrap APIs that already return promises.
- Asynchronous event handlers MUST surface failures through an established
  error path.

## 12. Errors

- Throw `Error` instances, not strings, numbers, or plain objects.
- Error messages MUST state what failed and include safe operational context.
- Catch an error only to recover, translate it, add context, perform cleanup, or
  report it at the owning boundary.
- Unknown caught values MUST be narrowed before their properties are read.
- Wrapped errors SHOULD preserve the original error with `cause`.
- Expected domain outcomes SHOULD use a typed result or a specific error type
  when callers must branch on them.
- Callers MUST NOT branch on human-readable error-message text. Use a stable
  code, class, or discriminant.
- Cleanup MUST use `finally` when it must occur on success and failure.
- Public error output MUST NOT expose stack traces, secrets, internal paths, or
  dependency internals.
- Errors MUST NOT be swallowed. Intentional suppression requires a comment and,
  where operationally relevant, structured reporting.

## 13. Runtime Validation Boundaries

Static types do not validate runtime values. Validation MUST occur where
untrusted data enters the trusted core, including:

- parsed JSON and serialized messages;
- command-line arguments and environment variables;
- file contents and user input;
- network and process responses;
- persisted values whose shape may outlive the current code;
- values returned by untyped or weakly typed dependencies.

Boundary validation MUST:

1. Begin from `unknown`.
2. Check the complete required shape, value ranges, formats, and limits.
3. Reject unknown fields when accepting them would be unsafe or misleading.
4. Normalize or coerce only by an explicit, documented rule.
5. Return a trusted internal value or a structured validation error.

- The string `"false"` MUST NOT become `true` through generic truthiness.
- Dates MUST be checked for format and validity before conversion.
- Identifiers, URLs, numeric bounds, collection lengths, nesting depth, and file
  sizes SHOULD be constrained according to the operation.
- Validation and transformation SHOULD occur once at the boundary. Trusted core
  logic SHOULD receive normalized values.
- Types SHOULD be inferred from the runtime schema when tooling supports it;
  duplicated schemas and types MUST be kept synchronized by tests or generation.
- Validation MUST NOT execute untrusted code or permit prototype pollution.

## 14. Modules and Dependency Design

- Modules MUST have explicit responsibilities and narrow public surfaces.
- High-level policy SHOULD depend on small contracts, not concrete I/O details.
- Side effects SHOULD be isolated in adapters. Core transformations SHOULD not
  import environment, filesystem, clock, randomness, or network access directly
  when those dependencies need deterministic testing.
- Dependencies SHOULD be passed explicitly when ownership or substitution
  matters. Global service locators MUST be avoided.
- Import direction MUST follow ownership. Lower-level modules MUST NOT import
  higher-level orchestration modules.
- Circular dependencies MUST be removed rather than hidden with dynamic imports.
- Imports MUST use the package's declared entry points. Deep imports into
  dependency internals MUST be avoided.
- Type-only dependencies MUST use `import type` when supported.
- A module MUST NOT perform surprising work at import time. Expensive I/O,
  timers, mutable registration, and environment-dependent initialization belong
  in explicit startup functions.
- Dynamic imports SHOULD be reserved for optional capabilities, deliberate code
  splitting, or cycle-free deferred loading.
- Public exports MUST be intentional. Internal symbols SHOULD remain private to
  their module or package.

## 15. Configuration and Secrets

- Configuration MUST be read through one explicit boundary and validated before
  dependent work begins.
- Required values MUST fail fast with a clear, non-secret error.
- Defaults MUST be safe, documented, and appropriate for every environment in
  which they apply.
- Environment variables are strings or absent. Code MUST parse booleans,
  numbers, lists, URLs, and durations explicitly.
- Secrets MUST come from the designated secret mechanism or runtime environment.
  They MUST NOT be committed, embedded in source, test snapshots, examples, or
  default configuration.
- Publicly exposed configuration MUST contain no private values. Naming a value
  "public" does not make it safe.
- Secret values MUST NOT be used as lookup keys or included in thrown errors.
- Configuration SHOULD be represented as an immutable typed object after
  validation.
- Tests MUST use obvious fake credentials and isolated configuration.
- Example files SHOULD contain placeholders such as `<SERVICE_TOKEN>`, never
  realistic credentials.

## 16. Logging and Diagnostics

- Application logging SHOULD use the repository's structured logger.
- Log records SHOULD include an event name, outcome, duration when useful, and
  stable correlation identifiers.
- Log levels MUST reflect actionability: debug detail, routine information,
  recoverable concern, or failed operation.
- Errors SHOULD be logged once at the boundary that owns reporting. Repeatedly
  logging and rethrowing the same failure MUST be avoided.
- Logs MUST NOT contain passwords, tokens, authorization data, cookies, private
  keys, full secrets, or unnecessary personal data.
- Sensitive fields MUST be redacted by key and by known nested location.
- Raw request, response, environment, or configuration objects MUST NOT be
  logged wholesale.
- `console.log` and temporary diagnostics MUST NOT remain in committed
  application code when structured logging is available.
- High-volume paths SHOULD avoid per-item logs unless sampling or debug-level
  controls exist.

## 17. Testing

- Tests MUST verify observable behavior, contracts, and invariants.
- Every defect fix SHOULD include a test that fails without the fix.
- Tests MUST cover relevant success, invalid-input, boundary, and failure paths.
- Pure logic SHOULD use fast deterministic unit tests.
- Integration tests SHOULD verify boundaries such as serialization, storage,
  files, processes, and external adapters using controlled dependencies.
- Mock only true boundaries. Do not mock the function under test or invent API
  methods absent from the real dependency.
- Fakes MUST preserve important semantics of the real dependency.
- Time, randomness, identifiers, and environment SHOULD be controlled when they
  affect assertions.
- Asynchronous tests MUST await completion and MUST fail on rejected work.
- Tests MUST NOT depend on execution order, shared mutable state, live external
  services, or arbitrary sleeps.
- Snapshot tests SHOULD be used only when the entire serialized output is a
  meaningful reviewed contract. Focused assertions are preferred.
- Type-level behavior SHOULD be tested with the repository's established type
  assertion tooling when public generic contracts are complex.
- Coverage numbers MUST NOT replace meaningful assertions.
- Empty existence tests are prohibited as the only coverage for behavior.

## 18. Packages and Dependencies

- Use the package manager selected by the existing lockfile.
- A change MUST NOT create or replace a lockfile with another package manager.
- Runtime packages and development-only packages MUST be classified correctly.
- Before adding a dependency, the agent MUST check whether the language,
  runtime, or an existing package already provides the capability.
- New dependencies SHOULD be maintained, compatible with supported runtimes,
  appropriately licensed, and proportionate in size and risk.
- Package versions MUST follow repository policy. Exact versions, ranges, and
  overrides MUST NOT be changed casually.
- Imports MUST correspond to declared direct dependencies of the package that
  uses them.
- Peer dependencies MUST represent packages supplied by the consumer, not a way
  to avoid declaring runtime requirements.
- Dependency upgrades SHOULD be scoped, changelogs reviewed, and relevant tests
  run. Major upgrades MUST NOT be mixed into unrelated work.
- Lockfile changes MUST be reviewed for unexpected packages, source URLs,
  scripts, and broad transitive churn.
- Install scripts and package provenance SHOULD be treated as a security
  boundary.
- Unused dependencies MUST be removed together with their imports and
  configuration.

## 19. Formatting and Static Analysis

- Repository formatter output is authoritative. Manual alignment MUST NOT fight
  the formatter.
- Existing indentation, quote, semicolon, trailing-comma, and line-width policy
  MUST be followed.
- If a new repository has no policy, use 2-space indentation, double quotes,
  semicolons, trailing commas where valid, and an 80-character target line
  width.
- Linter warnings MUST be treated according to repository policy and MUST NOT be
  silenced without a reason.
- Auto-fix MAY be used on changed files during editing. Final verification MUST
  include a non-mutating check.
- Formatting and linting MUST NOT rewrite unrelated files.
- Ignore files SHOULD exclude generated output, not source that is inconvenient
  to check.

## 20. Verification Commands

Use scripts already declared by the repository. The names below are explicit
placeholders, not commands to copy unchanged:

```bash
<PACKAGE_MANAGER> run <FORMAT_CHECK_SCRIPT>
<PACKAGE_MANAGER> run <LINT_SCRIPT>
<PACKAGE_MANAGER> run <TYPECHECK_SCRIPT>
<PACKAGE_MANAGER> run <FOCUSED_TEST_SCRIPT> -- <TEST_PATH_OR_PATTERN>
<PACKAGE_MANAGER> run <FULL_TEST_SCRIPT>
<PACKAGE_MANAGER> run <BUILD_SCRIPT>
```

When no scripts exist, invoke installed local tools through the selected package
manager rather than relying on unpinned global installations:

```bash
<PACKAGE_MANAGER_EXEC> <FORMATTER> --check <CHANGED_PATHS>
<PACKAGE_MANAGER_EXEC> <LINTER> <CHANGED_PATHS>
<PACKAGE_MANAGER_EXEC> tsc --noEmit --project <TSCONFIG_PATH>
<PACKAGE_MANAGER_EXEC> <TEST_RUNNER> <TEST_PATH_OR_PATTERN>
```

- Commands MUST be adapted to actual repository scripts and paths.
- Type-checking MUST use the intended project configuration, not an accidental
  default.
- A successful type-check does not replace tests, and passing tests do not
  replace static analysis.
- Build verification is required when changing exports, module resolution,
  compiler settings, declaration output, packaging, or runtime entry points.
- The agent MUST distinguish new failures from verified pre-existing failures.
- Verification output MUST NOT be falsified or summarized as passing when a
  command was not run.

## 21. Prohibited Anti-Patterns

The agent MUST NOT introduce:

- `var`, implicit globals, or accidental module-level mutable state;
- pervasive `any`, double assertions, blanket suppression directives, or
  non-null assertions used to bypass proof;
- weakened compiler strictness to accommodate incorrect code;
- types that claim unvalidated runtime data is trusted;
- transport strings typed as `Date` or serialized values typed as runtime class
  instances;
- models with every field optional when only specific states are valid;
- mutation of caller-owned input without an explicit contract;
- floating promises, swallowed rejections, or fire-and-forget work without
  ownership;
- unbounded retries, unbounded concurrency, or arbitrary delay-based
  synchronization;
- empty catch blocks or errors thrown as non-`Error` values;
- branching on error-message text;
- hidden import-time I/O or configuration-dependent side effects;
- circular imports, convenience barrel cycles, or dependency deep imports;
- hard-coded secrets, realistic credentials in examples, or secrets in logs;
- raw untrusted keys assigned into normal objects without validation;
- unsafe parsing that relies on truthiness or unchecked coercion;
- unstable tests, live-service tests in the default suite, arbitrary sleeps, or
  assertions that only prove a symbol exists;
- dependencies added for trivial functionality already available locally;
- unrelated lockfile churn, generated output, debug logs, dead code, or
  commented-out implementations;
- formatter or linter changes made solely to hide a new violation;
- claims of successful verification for checks that did not run.
