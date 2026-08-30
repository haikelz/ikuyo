# General Repository and Engineering Harness Guideline

## 1. Purpose

This document defines a project-neutral operating protocol for repository work by humans and coding agents.

The engineering harness is a compact, Git-native repository protocol and safe maintenance mechanism.
It consists of concise instructions, durable documentation, canonical commands, executable checks, and evidence needed to understand and maintain a repository safely.

The harness MUST NOT become:

- A task database.
- A story tracker.
- An orchestration lifecycle.
- A parallel source of product truth.
- A second project-management system.

Apply these principles throughout:

- Correctness, security, and explicit contracts MUST take priority over elegance.
- The smallest complete solution SHOULD be preferred over speculative machinery.
- Existing repository patterns SHOULD be reused unless they conflict with stronger authority or are unsafe.
- Important repeated rules SHOULD become executable checks when practical.
- Repository memory SHOULD remain readable through ordinary Git tools.
- High-volume events and traces SHOULD remain in existing trackers or artifact systems.
- Contributors MUST report only proof that was actually obtained.

## 2. Requirement Language and Precedence

The keywords **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **AVOID** are normative.
A SHOULD may be overridden when the reason is explicit and safety is preserved.

When instructions conflict, use this precedence:

1. Applicable law, safety constraints, and platform-enforced policy.
2. The current authorized request and accepted acceptance criteria.
3. Approved product contracts, public schemas, and operational policy.
4. Accepted architecture decision records (ADRs).
5. Applicable repository instructions, with the closest nested `AGENTS.md` taking precedence.
6. Current architecture and domain documentation.
7. Executable and observed repository truth.
8. Dominant local conventions.
9. General engineering guidance.

Conflicts MUST be surfaced rather than silently resolved.
A contributor MUST obtain human authority before selecting among materially different externally visible outcomes when no normative source decides between them.

## 3. Four Independent Work Dimensions

Work MUST be reasoned about along four separate dimensions.
They MUST NOT be collapsed into one mandatory tiny, normal, or high-risk lane.

### 3.1 Mutation authority

- **Read-only:** inspect and explain without intentional mutation.
- **Change-authorized:** modify only what is needed for the requested outcome.

Discovery does not grant mutation authority.
Finding a defect, stale document, missing check, or absent harness file MUST NOT be treated as permission to fix it.

### 3.2 Memory need

- **Bounded:** work fits within the current session and request context.
- **Durable:** work needs a resumable plan because it spans sessions, has multiple consequential steps, or requires handoff.

Memory need determines whether a durable plan is useful.
It does not determine mutation authority, approval, or proof depth.

### 3.3 Human judgment need

- **Clear authority:** normative sources select the intended outcome.
- **Missing normative authority:** materially different outcomes remain possible and require an authorized human decision.

Code, tests, defaults, configuration, and runtime behavior can establish what exists.
They cannot invent unresolved product policy.

### 3.4 Proof depth

Proof depth depends on changed behavior, affected boundaries, blast radius, reversibility, data sensitivity, compatibility, and operational consequence.
It does not depend only on line count or planning format.

Consumer trackers MAY use optional risk labels.
Such labels are not harness core and MUST NOT replace direct reasoning about these four dimensions.

## 4. Default Work Shapes

Use one of three simple work shapes by default.

### 4.1 Read-only work

Questions, reviews, explanations, diagnosis, comparisons, and planning are read-only unless change authority is explicit.

For read-only work, a contributor:

- MUST inspect only enough context to answer reliably.
- MUST distinguish facts, inference, and uncertainty.
- MUST choose non-mutating commands where available.
- MUST NOT edit files, install dependencies, run migrations, or initialize harness state.
- MUST avoid commands known to write caches, lockfiles, generated files, or persistent runtime state.
- MUST report unavoidable uncertainty and possible side effects.

### 4.2 Bounded change with an ephemeral plan

Most changes SHOULD use a short plan held in the working context.
No tracked intake, story, task, trace, or report file is required.

The contributor MUST:

- Confirm change authority.
- Inspect applicable instructions and current state.
- State or mentally maintain a bounded sequence of actions.
- Make the smallest complete change.
- Run behavior-matched proof.
- Review the final diff and report results.

### 4.3 Durable planned change

Use a durable plan only when the work genuinely needs repository-resident memory.
Maintain ONE evolving file under `docs/plans/active/`.

The plan SHOULD contain:

- Outcome and acceptance criteria.
- Scope and non-goals.
- Applicable authority and unresolved decisions.
- Affected boundaries and owners.
- Current implementation plan.
- Validation, rollout, rollback, and recovery considerations where applicable.
- Durable progress and blockers needed for resumption.

Update this same file as understanding changes.
Do not create parallel intake, story, trace, status, and validation-report state for the same work.
After validation, move the plan to `docs/plans/completed/` and record the final disposition concisely.
A completed plan is memory, not proof.

## 5. Normative Authority and Observed Truth

Repositories contain two kinds of evidence that MUST remain distinct.

### 5.1 Normative authority

Normative sources state what the product or operation is required to do.
Examples include:

- Approved product contracts.
- Public API and schema commitments.
- Accepted ADRs.
- Authorized operational and security policy.
- Explicit acceptance criteria.

### 5.2 Observed and executable truth

Observed sources show current behavior or enforcement.
Examples include:

- Code.
- Tests.
- Configuration and defaults.
- Build and deployment definitions.
- Runtime observations.
- CI configuration and results.

Observed truth can reveal drift, defects, and undocumented behavior.
It MUST NOT be promoted automatically into externally visible policy.

If normative and observed truth disagree:

1. Identify the disagreement.
2. Determine whether an existing authority resolves it.
3. Preserve safety and compatibility while investigating.
4. Stop for human authority when materially different outcomes remain.
5. Update the appropriate contract and implementation together after a decision.

Tests MUST NOT be changed merely to make an incorrect implementation pass.
Documentation MUST NOT be changed merely to rationalize accidental behavior.

## 6. Repository Memory and Source of Truth

Durable repository memory includes:

- Product documentation.
- Architecture documentation.
- ADRs.
- Active and completed plans.
- Code, tests, schemas, and CI configuration.
- Runtime evidence retained by the repository's existing systems.
- Git history.

Each durable fact SHOULD have one canonical home.
Other files SHOULD link rather than duplicate it.

| Concern | Canonical home |
| --- | --- |
| Intended user-visible behavior | Product contract and public schema |
| Current executable behavior | Code and behavior-matched tests |
| Architecture direction | Architecture docs and accepted ADRs |
| Repository operation | `AGENTS.md`, README, and canonical scripts |
| Setup and onboarding | README and owned setup scripts |
| Durable change memory | One active or completed plan when needed |
| Deployment and recovery | Versioned configuration and runbooks |
| Historical rationale | ADRs and Git history |
| High-volume events and traces | Existing tracker, CI, or artifact system |

The harness MUST NOT add SQLite task state by default.
It MUST NOT mirror issue status, story transitions, command traces, or agent events into a local database.
Existing external systems SHOULD retain high-volume operational records.

## 7. Progressive Context Retrieval

Context retrieval MUST be progressive.
Entry instructions SHOULD be compact and navigational.

Start with:

1. The authorized request.
2. Applicable `AGENTS.md` files.
3. Current worktree state when relevant.
4. The nearest authoritative contract.
5. Target code, configuration, and tests.

Expand to architecture, ADRs, ownership, schemas, runbooks, and adjacent implementation only when the task requires them.

Stop retrieving context when:

- Enough authoritative evidence exists to proceed or answer.
- Additional files are outside the bounded outcome.
- A missing normative decision requires a human.
- A missing capability prevents safe progress.
- The next action is already supported by direct evidence.

Reading the entire repository by default SHOULD be avoided.
Searches SHOULD prefer current authority and exclude archives, generated output, dependencies, and caches where practical.

## 8. `AGENTS.md` Instructions

### 8.1 Root instructions

The root `AGENTS.md` SHOULD be concise and include:

- Read-only versus change-authorized rules.
- A short repository map.
- Exact canonical setup and validation commands.
- Critical architecture, security, dependency, and generated-file boundaries.
- Links to product docs, architecture, ADRs, plans, and runbooks.
- Requirements to preserve unrelated work and report evidence honestly.

It SHOULD NOT contain a task lifecycle, mandatory risk lane scheme, encyclopedic style guide, or duplicated product manual.

### 8.2 Nested instructions

A nested `AGENTS.md` SHOULD exist only for materially different local ownership, commands, generated boundaries, technologies, or constraints.
It MUST state its scope and contain only local differences.
AVOID one instruction file per directory.

## 9. README and Onboarding

The README MUST help a new contributor reach a working state without private oral knowledge.
It SHOULD include:

- Purpose, consumers, and non-goals.
- Supported platforms and prerequisites.
- Configuration, dependency installation, and first-run steps.
- Generic placeholders and safe development defaults.
- Canonical format, lint, test, build, run, and stop commands.
- A smoke test and expected result.
- Links to deeper documentation and runbooks.
- Common setup failures and recovery steps.

Onboarding SHOULD be tested from a clean checkout.
Setup scripts SHOULD fail with actionable messages instead of silently rewriting unknown state.
Generic harness templates MUST NOT invent repository-specific commands, credentials, readiness checks, cleanup, policy, or application operation.

## 10. Product Documentation

Product documentation describes intended behavior, not implementation trivia or task history.
Organize it by stable capability or domain.

A product contract SHOULD define:

- User or consumer and intended outcome.
- Scope and explicit non-goals.
- Inputs, outputs, errors, permissions, and invariants.
- Public compatibility obligations.
- Relevant schemas and observability expectations.
- Acceptance examples.
- Owning role and review trigger.

An unresolved externally visible choice MUST be decided by human authority.
Implementation convenience MUST NOT supply product policy.

## 11. Architecture, Boundaries, and Ownership

Architecture documentation SHOULD explain facts not quickly inferable from the tree:

- Runtime components and dependency direction.
- Trust, process, network, data, and transaction boundaries.
- Data ownership and consistency model.
- Public contracts and compatibility strategy.
- External systems and failure assumptions.
- Runtime entry points and deployment topology.
- Mechanically enforced constraints and known exceptions.

Architecture docs MUST describe the current intended system.
They MUST NOT present an aspirational redesign as fact.

Significant modules SHOULD identify:

- Technical and product owner roles.
- Owned data and schemas.
- Public interfaces and consumers.
- Security and domain invariants.
- Expected proof and operational signals.
- Escalation route for breaking changes.

Cross-boundary access MUST use explicit interfaces.
Private storage and internals MUST NOT be reached through by unrelated modules.
Cycles SHOULD be prevented mechanically where important.
Exceptions SHOULD be narrow, documented, and owned.

## 12. Architecture Decision Records

Use an ADR for consequential, durable decisions involving architecture, security, data ownership, compatibility, major dependencies, or difficult-to-reverse operations.

Statuses SHOULD be `proposed`, `accepted`, `superseded`, or `rejected`.

An ADR SHOULD contain:

- Context and decision drivers.
- Options considered.
- Decision and scope.
- Consequences and known risks.
- Validation and reversal or supersession approach.
- Links to affected contracts and implementation.

Accepted ADRs MUST retain historical rationale.
Supersede them with a linked new ADR rather than rewriting history.
Routine implementation choices SHOULD remain in code or a plan.

## 13. Intake and Existing Trackers

The authorized request, issue, or existing tracker entry is sufficient intake by default.
The harness MUST NOT require a second intake record.

Before changing code, establish only what is needed:

- Requested outcome.
- Observable acceptance criteria.
- Scope and non-goals.
- Applicable normative authority.
- Affected boundaries and ownership.
- Open decisions that block safe implementation.
- Appropriate proof depth.

Existing trackers MAY own assignment, priority, status, dependencies, and high-volume discussion.
Repository plans SHOULD link to tracker items when useful but MUST NOT mirror their lifecycle.

## 14. Planning and Durable Work

Planning is a reasoning aid, not a gate or proof artifact.
An ephemeral plan is preferred for bounded work.

A durable plan is justified when:

- Work spans sessions or contributors.
- Multiple coordinated steps must remain resumable.
- Migration or rollout sequencing is consequential.
- Important decisions and blockers need repository review.

A durable plan MUST remain one evolving file.
It SHOULD be deleted if abandoned before becoming useful, or moved to completed with an explicit disposition when it has lasting value.

Plans MUST NOT claim validation merely by containing a validation section.
Plans SHOULD link to canonical contracts and commands rather than duplicate them.

## 15. Proof Model

Completion requires behavior-matched executable or observable proof.
Plans, reports, checklists, scores, labels, and code review alone are not proof.

Choose proof according to behavior and blast radius:

- Formatting proof for deterministic formatting changes.
- Static analysis for encoded source policies.
- Type or compile checks for interface consistency.
- Unit tests for local behavior.
- Integration tests for process, storage, service, or network boundaries.
- Contract or schema tests for compatibility.
- End-to-end observations for user-visible flows.
- Runtime signals for operational behavior.
- Migration and recovery rehearsal for persistent state.
- Security tests for authorization and trust boundaries.
- Performance measurements for stated budgets.
- Accessibility and visual checks for applicable interfaces.

Coverage percentages MAY guide investigation but MUST NOT substitute for behavioral evidence.
A broad test suite MAY be unnecessary for a narrow change.
A narrow unit test MUST NOT be presented as proof of a changed cross-system behavior.

## 16. Positive and Negative Proof

When an invariant is encoded, proof MUST include:

1. A positive case showing an allowed form succeeds.
2. A negative case showing the forbidden form fails.
3. Evidence that failure occurs for the intended reason.

This applies especially to:

- Authorization and access control.
- Architecture dependency boundaries.
- Schema validation.
- Path and input validation.
- Secret and policy checks.
- Installer ownership and conflict rules.
- Migration preconditions.

A negative test that fails because setup is broken does not prove the invariant.
Error type, message, exit status, or observed denial SHOULD identify the intended enforcement point.

## 17. Enforcement Levels

Enforcement claims MUST identify their actual level:

1. **Local command:** available to run manually.
2. **Optional hook:** installed locally and bypassable.
3. **Checked-in CI:** configured in repository CI files.
4. **Observed CI result:** a specific run executed with a known outcome.
5. **External branch protection:** hosting policy requires checks or review.

One level does not prove another.
A passing local command does not prove CI ran.
A checked-in workflow does not prove branch protection requires it.
An optional hook does not enforce remote merges.
An observed CI result MUST identify the relevant revision or artifact when consequential.

## 18. Canonical Commands

Consumer repositories own their runnable setup, validation, and operational commands.
The harness MUST discover commands from README files, manifests, scripts, CI, and runbooks.
It MUST NOT invent them.

A small command surface SHOULD cover applicable capabilities:

```text
setup, dev, build, clean
format, format-check, lint, typecheck
test, test-integration, test-e2e, validate, generate
```

Names MAY differ.
Canonical commands MUST:

- Run from a documented working directory.
- Return nonzero on failure.
- Be noninteractive in CI.
- Avoid hidden environment mutation.
- Print actionable failures.
- Avoid deleting resources they did not create.

Do not add wrappers that only rename an already clear command without improving stability or portability.

## 19. CI Quality Gates

Checked-in CI SHOULD run the repository's applicable canonical checks.
Depending on behavior, these may include:

- Format, lint, type, compile, and unit checks.
- Integration, contract, and schema checks.
- Build and generated-artifact drift checks.
- Secret and dependency checks.
- Architecture boundary checks.
- Migration, end-to-end, or deployment smoke tests.

CI SHOULD be deterministic, parallel where safe, and diagnosable.
Required checks MUST NOT be silently skipped by fragile filters.
Flaky checks SHOULD have an owner, issue, containment plan, and removal deadline.
Retries MUST NOT conceal instability.

External branch protection is outside repository configuration unless managed as versioned infrastructure.
Its presence MUST be observed directly before being claimed.

## 20. Local Hooks

Hooks SHOULD optimize feedback and MUST NOT be the only enforcement layer.

- Pre-commit hooks SHOULD remain fast.
- Pre-push hooks MAY run broader checks.
- Hooks MUST NOT require production access or destructive action.
- Installation SHOULD be explicit and documented.
- Hooks SHOULD NOT silently modify global Git configuration.
- Bypassing a hook MUST NOT be reported as proof.

CI SHOULD repeat policies required for merge because local hooks are optional and bypassable.

## 21. No-Mutation Verification

A no-mutation claim requires more than a clean Git diff.
The assessment MUST consider tracked, untracked, and ignored Git paths; local configuration; dependency directories; build and test caches; generated artifacts; runtime processes and containers; images, networks, and volumes; databases and external development services; and temporary or operating-system paths.

Not every location must be exhaustively scanned for every read-only request.
The contributor MUST reason from commands actually run and inspect plausible mutation surfaces.
If a tool may have written outside visible Git state, the report MUST qualify the no-mutation claim.

## 22. Generated Artifacts

Generated files MUST have an identifiable canonical source and deterministic generation command.

- Edit the source, not generated output.
- Document whether output is tracked.
- If tracked, CI SHOULD detect generation drift.
- Pin or otherwise reproduce generator versions.
- Avoid machine paths, timestamps, secrets, and nondeterministic ordering.
- Keep caches, logs, binaries, and high-volume reports out of Git unless they are intentional release artifacts.

Generated markers SHOULD be used where the format permits.
Generated output MUST NOT become a second editable authority.

## 23. Security, Secrets, and Fixtures

- Secrets MUST NOT enter code, docs, examples, logs, plans, fixtures, snapshots, artifacts, or reports.
- Use placeholders such as `<SERVICE_TOKEN>`, `<DATABASE_URL>`, and `<ENVIRONMENT>`.
- Configuration examples SHOULD document purpose and safe defaults.
- Sensitive values MUST be redacted from proof.
- Authorization MUST be enforced at trusted boundaries.
- Authorization changes MUST include positive and negative proof.
- Fixtures SHOULD be minimal, deterministic, synthetic, and isolated.
- Production data MUST NOT be used without an approved sanitization process.
- Destructive scripts MUST require explicit target selection and recovery guidance.

Confirmed secret exposure MUST follow an owned incident process, including revocation where required.

## 24. Dependency Policy

Before adding a dependency, check the standard library, platform, framework, and existing dependencies.

Evaluate:

- Necessity and expected lifetime.
- Maintenance and license status.
- Security and supply-chain posture.
- Transitive size and runtime or build impact.
- Platform compatibility.
- API stability and replacement cost.

Dependencies MUST use the repository's canonical manifest and package manager.
Lockfiles MUST NOT be hand-edited.
AVOID duplicate libraries, unpinned remote scripts, abandoned packages, and dependencies added for trivial local code.

## 25. Git, Pull Requests, and Review

- Inspect status before editing and before completion.
- Preserve unrelated work.
- Stage and commit only intended files when authorized.
- Keep commits coherent and reviewable.
- Do not rewrite shared history without explicit authority.
- Separate generated or mechanical changes when that improves review.

A pull request SHOULD state:

- Problem and intended outcome.
- Scope and non-goals.
- Contract, architecture, security, data, and operational effects.
- Exact validation evidence.
- Visual evidence where relevant.
- Migration, rollout, and rollback notes where applicable.
- Remaining concerns and follow-up work.

Reviewers SHOULD prioritize behavior, contracts, security, data integrity, boundaries, failure modes, and proof before style.

## 26. Migrations, Rollout, and Rollback

Persistent-data, API, event, and configuration migrations MUST consider mixed-version operation where applicable.
Prefer an expand, migrate, contract sequence:

1. Add compatible structures.
2. Deploy compatible readers and writers.
3. Backfill with bounded, restartable work.
4. Verify behavior and observability.
5. Switch behavior deliberately.
6. Remove obsolete structures after rollback windows close.

Migrations MUST be idempotent or safely resumable.
They SHOULD be tested with representative volume.
They MUST state lock, duration, failure, recovery, and backup expectations.

Rollout plans SHOULD define target, sequence, audience, health signals, thresholds, pause criteria, and owner.
Rollback plans MUST define triggers, exact actions, data constraints, responsibility, and post-rollback verification.
“Revert the commit” is insufficient when external effects or incompatible data exist.

Feature flags MAY separate rollout from deployment or support rapid disablement.
Each flag MUST have an owner, purpose, default, target environments, safe failure behavior, telemetry, and removal condition.
Flags MUST NOT replace authorization; stale flags and dead branches SHOULD be removed.

## 27. Operational Runbooks

Create runbooks for recurring, privileged, time-sensitive, or failure-prone operations.
Each runbook SHOULD include:

- Purpose, scope, owner, and permissions.
- Symptoms and decision criteria.
- Safety warnings and stop conditions.
- Commands with generic placeholders.
- Expected output and checkpoints.
- Escalation, rollback, and recovery.
- Verification and cleanup.
- Last tested date or review trigger.

Consumer repositories own runnable runbooks.
Generic templates MUST NOT invent credentials, environment names, readiness signals, cleanup actions, or operating policy.
Runbooks SHOULD be rehearsed safely.

## 28. Documentation Freshness and Searchability

Documentation MUST change with the contract or operation it describes.
Material docs SHOULD identify an owning role and review trigger.

Useful drift checks include:

- Internal links and referenced paths.
- Existence of documented commands.
- Generated reference drift.
- Schema validation of examples.
- Periodic clean setup and runbook rehearsal.

Current-tree searches SHOULD find current authority cleanly.
Obsolete commands and policies MUST be removed or moved to an archive excluded from normal retrieval.
Do not preserve searchable legacy machinery in normal docs “for reference.”
Git history already preserves prior tracked content.

## 29. Degraded Operation

If a tool, credential, service, network path, or environment is unavailable:

1. Do not bypass security or fabricate evidence.
2. Identify the unavailable capability and affected proof.
3. Use a documented safe fallback if one exists.
4. Run unaffected checks.
5. Report partial validation or a blocker accurately.
6. State the recovery action needed.

A fallback MUST NOT be presented as equivalent when it exercises different behavior.
Harness failure MUST NOT prevent ordinary Git and native repository commands from remaining understandable.
Potentially non-idempotent operations MUST NOT be retried blindly after an uncertain result.

## 30. Distributable Harness Local State

If a distributable harness exists, installer or updater local state MUST be provenance-only.
It MAY record:

- Managed paths.
- Installed bytes or cryptographic hashes.
- Pinned release identity and schema version.
- Staged transaction state.
- Detected conflicts and candidate resolution.

It MUST NOT store:

- Product requirements.
- Task status or acceptance truth.
- Story lifecycle.
- Validation claims.
- Architecture decisions.
- Runtime product state.

Provenance state SHOULD be rebuildable or safely diagnosable.
Read-only discovery MUST NOT initialize or migrate it.

## 31. Safe Installation and Update

A distributable installer or updater MUST adopt compatible existing files rather than overwrite them and give each managed block one canonical source.
Dry-run MUST write nothing; releases MUST be pinned and checksums verified before activation.
Mutation MUST be locked, and interrupted transactions MUST be recovered before new writes.
Unsupported schemas, path traversal, unsafe symlinks, and duplicate managed targets MUST be rejected safely.
Conflicts MUST be staged outside live authority as `BASE`, `LOCAL`, `UPSTREAM`, and `RESOLVED` candidates; conflict markers MUST NOT enter operational instruction files.
Only complete verified state may activate atomically, and unsupported legacy consumer state MUST remain unless an explicit authorized migration or removal exists.

Installation SHOULD be idempotent.
Failure messages MUST describe safe recovery.
Managed-block markers MUST be stable and unambiguous.
An updater MUST NOT infer ownership merely because a path matches a template.

## 32. Adoption Without a Maturity Ladder

Adopt only mechanisms justified by current repository needs.
There is no required maturity ladder.

Start with:

- A runnable README.
- Compact `AGENTS.md` instructions.
- Canonical native commands.
- Relevant tests and checked-in CI.
- Product and architecture docs only where needed.

Add nested instructions, ADRs, durable plans, runbooks, or installer machinery only in response to demonstrated boundaries or recurring needs.
More files, labels, scores, traces, and automation do not imply greater maturity.
The least complex protocol that reliably supports safe work SHOULD be preferred.

## 33. Empirical Improvement Loop

Harness improvement MUST be explicit, bounded, and empirical.
Use this loop:

1. Observe a representative baseline and the human intervention it currently requires.
2. Identify the earliest missing owner, boundary, instruction, or executable check.
3. Propose one falsifiable intervention.
4. Make the smallest authorized change.
5. Validate with the repository's native commands.
6. Run a materially equivalent fresh-agent attempt.
7. Prove that the rerun retrieved or exercised the intervention.
8. Decide: keep, revise, remove, or leave pending with a stated reason.

The baseline and rerun SHOULD use comparable requests and conditions.
The intervention MUST have an observable predicted effect.
A score, document count, or agent claim is not proof.
Policy MUST NOT rewrite itself automatically based on traces or scores.
Consequential policy changes require human authority.

## 34. Definition of Done

### Read-only work

Read-only work is done when:

- The request is answered.
- Claims are supported by repository evidence.
- Facts, inference, and uncertainty are distinguished.
- Plausible mutation surfaces have been considered.
- Any inability to establish no mutation is disclosed.

### Change work

Change work is done when:

- Authorized acceptance criteria are satisfied or a blocker is explicit.
- Scope is bounded and unrelated work is preserved.
- Relevant architecture, security, and ownership rules are followed.
- Behavior-matched executable or observable proof has a known outcome.
- Encoded invariants have positive and negative proof.
- Contracts, schemas, docs, generated output, and runbooks are current where affected.
- Migration, rollout, rollback, and recovery needs are addressed.
- No secrets, unsafe fixtures, placeholders, or accidental artifacts were introduced.
- The final diff and status were reviewed.
- The report states evidence and uncertainty honestly.
- Any durable active plan was moved to completed after validation.

Completion MUST NOT require intake duplication, lifecycle transitions, risk labels, a proof matrix, a validation report, or task-database records.
The completion report SHOULD state outcome, scope, changed components, exact proof and outcomes, contract or operational effects, and remaining uncertainty.
It MUST disclose failed, skipped, and partial checks and MUST NOT cite a plan or report as behavioral proof.

## 35. Recommended Directory Tree

Adopt only justified portions:

```text
<repository>/
├── AGENTS.md
├── README.md
├── <contribution-ownership-and-configuration-files>
├── docs/
│   ├── architecture.md
│   ├── product/<capability>.md
│   ├── decisions/<number>-<decision>.md
│   ├── plans/
│   │   ├── active/<change>.md
│   │   └── completed/
│   ├── runbooks/<operation>.md
│   └── templates/<template>.md
├── scripts/
│   └── <owned-canonical-command>
├── src/
├── tests/
└── <build-and-dependency-manifests>
```

Small repositories SHOULD collapse this tree.
Empty directories and speculative templates SHOULD NOT be created.
There SHOULD be no default `tasks/`, `traces/`, `reports/`, or local task-database structure.

## 36. Practical Templates

### 36.1 Durable plan

```markdown
# Plan: <bounded outcome>

- Owner/status/authority: <values and link>

## Outcome and acceptance criteria

- <observable result>

## Scope and non-goals

- In scope: <items>
- Out of scope: <items>

## Authority and open decisions

- Normative sources: <links>
- Human decisions needed: <questions or none>

## Boundaries and ownership

- Components/owners: <items and roles>
- Security/data/compatibility effects: <summary>

## Evolving plan

1. <next meaningful step>

## Validation

- <behavior> → <canonical command or observation>
- Positive case: <proof>
- Forbidden case: <proof and intended failure>

## Rollout, rollback, and recovery

<steps or reason not applicable>

## Durable progress and blockers

<Only information needed to resume.>

## Final disposition

<Outcome and evidence links after validation.>
```

### 36.2 ADR

```markdown
# ADR <number>: <decision>

- Status/date/owners: <values>
- Supersedes: <link or none>

## Context and authority

<Problem, constraints, and drivers.>

## Options and decision

<Alternatives, trade-offs, chosen direction, and scope.>

## Consequences and validation

<Benefits, costs, proof, follow-up, and supersession path.>
```

### 36.3 Runbook

```markdown
# Runbook: <operation>

- Owner/scope/last tested: <values>

## Preconditions, permissions, and stop conditions

<requirements and safety limits>

## Procedure and expected signals

1. Confirm `<ENVIRONMENT>` and `<RESOURCE>`.
2. Run `<CANONICAL_COMMAND>` and verify <signal>.

## Failure, recovery, rollback, and cleanup

<Safe actions, escalation, verification, and retained evidence.>
```

## 37. New-Repository Checklist

Implement in order and stop when needs are met:

1. [ ] Define purpose, consumers, scope, and non-goals.
2. [ ] Select the actual stack and native build tools.
3. [ ] Add manifests, lockfiles, ignore rules, editor settings, and safe configuration examples.
4. [ ] Make setup, run, test, and build work from a clean checkout.
5. [ ] Write a concise README with a smoke test.
6. [ ] Add compact root `AGENTS.md` instructions.
7. [ ] Add applicable format, static, type, compile, and behavior checks behind canonical commands.
8. [ ] Configure checked-in CI; observe CI results and branch protection separately.
9. [ ] Document product contracts, public schemas, consequential boundaries, and ownership.
10. [ ] Add dependency, secret, fixture, and generated-output rules.
11. [ ] Add integration, contract, security, migration, and end-to-end proof according to behavior.
12. [ ] Add ADRs and runbooks only for consequential decisions and operations.
13. [ ] Define migration, rollout, rollback, and release evidence where applicable.
14. [ ] Test clean onboarding; add nested instructions only for real local differences.
15. [ ] Add durable plans only when repository memory is needed; keep task events and traces in existing systems.
16. [ ] Add distributable installation only for a real consumer need and improve it empirically.

The default posture is disciplined simplicity:

Establish authority, retrieve enough context, preserve normative distinctions, make the smallest authorized change, prove the affected behavior, retain only useful repository memory, and keep the harness subordinate to engineering work.
