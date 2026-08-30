# Docker Coding-Agent Guideline

This document defines container-specific rules for coding agents that create,
modify, review, or verify Docker build and deployment artifacts. Apply it with
the relevant language, framework, database, security, and repository guidance;
do not duplicate application logic or framework policy in container files.

The terms **MUST**, **SHOULD**, and **AVOID** are normative. Requirements and
repository-local instructions take precedence. Existing weak practices are not
precedent: preserve required compatibility while correcting unsafe patterns
within the task's scope.

## 1. Discovery and Scope

Before editing, the agent **MUST**:

1. Read applicable instructions, Dockerfiles, `.dockerignore`, Compose files,
   build scripts, CI workflows, deployment manifests, lockfiles, runtime version
   files, and application health and shutdown code. Never open populated secret
   files merely to inspect configuration.
2. Identify every build context, Dockerfile location, target stage, build
   platform, runtime platform, registry, orchestrator, and release owner affected.
3. Determine the real build output, runtime command, required assets, writable
   paths, listening port, shutdown grace period, and liveness/readiness/startup
   semantics from code and build output rather than assumptions.
4. Determine whether the image is a web process, worker, migration job, static
   binary, development environment, or multi-purpose image. Prefer one process
   role and one lifecycle per image.
5. Inspect existing language and framework guidance and keep dependency,
   generation, migration, and application concerns in their owning layer.
6. Check the working tree and make the smallest complete change. The agent MUST
   NOT rewrite unrelated container files or silently change deployment contracts.

The agent **SHOULD** trace all image consumers before changing the user, port,
entry point, filesystem layout, architecture, or health endpoints. It **MUST**
report compatibility assumptions and checks that could not be run.

## 2. OCI Image Principles

- An image **MUST** be reproducible from reviewed source, a lockfile, pinned
  inputs, and a declared build command. Mutable state belongs outside the image.
- Images **MUST** be immutable deployment artifacts. The same digest **MUST** be
  promoted between environments; an environment-specific rebuild is prohibited.
- Runtime images **MUST** contain only the executable application, required
  production dependencies, certificates, time-zone data when needed, and
  explicitly declared assets.
- Build tools, tests, source maps not needed at runtime, package caches, shells,
  and development dependencies **SHOULD** remain in earlier stages.
- Each image **SHOULD** have one operational responsibility and the smallest
  practical attack surface. Minimal does not mean unusable: required TLS roots,
  native libraries, and diagnostics policy must be deliberate.
- Layers **MUST NOT** contain secrets, private package credentials, local
  configuration, VCS history, or deleted secret material from an earlier layer.
- Images **MUST NOT** download code, packages, or executable plugins at startup.

## 3. Immutable Inputs and Pinning

- `FROM` images **MUST** use an approved, supported image and **SHOULD** be pinned
  by digest, retaining a readable tag: `FROM node:<NODE_VERSION>@sha256:<DIGEST>`.
- Floating tags such as `latest`, unqualified major tags, and mutable deployment
  tags **MUST NOT** be the only identity. Automated digest updates **SHOULD** be
  reviewed and tested through normal dependency-update workflows.
- Language dependencies **MUST** use the repository lockfile and immutable or
  frozen install mode. The selected package manager and version **MUST** match
  repository policy.
- Operating-system packages **MUST** be explicit and version-pinned where the
  base repository supports reliable pins. Repository snapshots or digest-pinned
  bases **SHOULD** be used when package versions otherwise disappear.
- Package metadata refresh and installation **MUST** occur in one layer, and
  package-manager caches **MUST** be removed unless a BuildKit cache mount owns
  them. Recommended packages **MUST** be disabled unless required.
- Agents **MUST NOT** run an unverified remote script through a shell. Downloaded
  tools **MUST** have a pinned version and verified checksum or signature.
- Pinning **MUST** include toolchain helpers such as Corepack package-manager
  versions, code generators, and native build tools; global unpinned installs are
  prohibited.

## 4. Dockerfile Syntax and Multi-Stage Structure

- New Dockerfiles **MUST** begin with a current syntax directive when BuildKit
  features are used, for example `# syntax=docker/dockerfile:1.7`.
- Instructions **MUST** be ordered for correctness and useful caching: stable
  dependency metadata first, dependency installation, source, build, then the
  minimal runtime stage.
- Stages **MUST** have descriptive lowercase names such as `deps`, `build`, and
  `runtime`. `COPY --from` **SHOULD** name a stage, not use a numeric index.
- `WORKDIR` **MUST** be absolute. `COPY` sources **MUST** be narrow and explicit.
- JSON/exec form **MUST** be used for runtime `ENTRYPOINT` and `CMD`.
- Related shell commands **SHOULD** use `set -eux` or an equivalent failure-safe
  shell mode where supported. Long opaque `RUN` scripts **SHOULD** move to a
  reviewed repository script only when reuse or readability justifies it.
- Build arguments **MUST NOT** carry secrets. `ARG` is visible in image history
  and build metadata. Runtime configuration **MUST NOT** be baked into the image.
- A stage **MUST NOT** copy an entire previous filesystem merely for convenience.

Concise generic pattern:

```dockerfile
# syntax=docker/dockerfile:1.7
ARG NODE_IMAGE=node:<NODE_VERSION>-slim@sha256:<NODE_IMAGE_DIGEST>

FROM ${NODE_IMAGE} AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm run build && pnpm prune --prod

FROM ${NODE_IMAGE} AS runtime
ENV NODE_ENV=production
WORKDIR /app
RUN groupadd --system --gid 10001 app && \
    useradd --system --uid 10001 --gid app --home-dir /nonexistent app
COPY --from=build --chown=10001:10001 /app/dist ./dist
COPY --from=build --chown=10001:10001 /app/node_modules ./node_modules
COPY --from=build --chown=10001:10001 /app/package.json ./package.json
USER 10001:10001
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

Placeholders **MUST** be replaced with reviewed values. Base-specific account
commands must be adapted rather than copied blindly.

## 5. BuildKit Caches, Secrets, and SSH

- BuildKit cache mounts **SHOULD** cache package downloads, compiler caches, and
  module caches, not final mutable dependency trees shared across platforms.
- Cache IDs **SHOULD** include the package manager and platform when cross-build
  collisions are possible. CI cache export/import **MUST** use a trusted scope.
- Private registry tokens, license files, and signing material needed during a
  build **MUST** use `RUN --mount=type=secret`; commands **MUST** read the mounted
  file and **MUST NOT** echo or copy it.
- Private Git access **MUST** use `RUN --mount=type=ssh` with known-host
  verification. Disabling host-key checks is prohibited.
- Secret and SSH mounts **MUST** be limited to the single instruction requiring
  them. Their absence **SHOULD** fail clearly.
- Build logs, cache exports, attestations, and error messages **MUST NOT** expose
  secret values.

```dockerfile
RUN --mount=type=secret,id=registry_config,target=/root/.config/example/config \
    --mount=type=cache,id=package-cache,target=/var/cache/example \
    <PACKAGE_INSTALL_COMMAND>
```

## 6. Build Context and `.dockerignore`

- Every build context **MUST** have an effective `.dockerignore` reviewed from
  that context root. An ignore file beside a Dockerfile outside the context does
  not protect the context unless the builder uses it explicitly.
- The context **MUST** exclude `.git`, local environment files, credentials,
  private keys, editor state, logs, coverage, caches, test artifacts, local
  databases, package stores, and build output that the image rebuilds.
- Ignore rules **MUST** account for nested workspaces and exception rules. The
  agent **MUST** verify that required manifests, lockfiles, source, migrations,
  and public assets remain included.
- `COPY . .` is acceptable only in a controlled build stage after the context is
  proven narrow. Explicit copies are preferred for security-sensitive builds.
- Excluding a file from the final image is insufficient; sensitive data **MUST**
  never enter the build context.

## 7. Node.js and pnpm

- Node.js major and pnpm version **MUST** be supported, repository-pinned, and
  consistent across local development, CI, and the image.
- Corepack **SHOULD** activate the exact `packageManager` version. An unpinned
  latest pnpm global install **MUST NOT** be used.
- Dependency installation **MUST** use `pnpm-lock.yaml` and
  `pnpm install --frozen-lockfile`. Workspace manifests and configuration needed
  for resolution **MUST** be copied before installation.
- pnpm store caching **SHOULD** use a BuildKit cache mount. A host `node_modules`
  directory **MUST NOT** enter the image.
- Production images **MUST** include only production dependencies or a pnpm
  deploy output. Pruning **MUST** happen after building when build tooling is a
  development dependency.
- Native modules **MUST** be built for the runtime OS, libc, CPU architecture,
  and Node ABI. Dependencies built on a different host **MUST NOT** be copied in.
- `NODE_ENV=production` **MUST** be set in the runtime image, not before a build
  that requires development dependencies.

## 8. Next.js Standalone Images

- Next.js container deployments **SHOULD** use `output: "standalone"` when it is
  compatible with the application and workspace.
- The runtime **MUST** copy the generated standalone tree, `.next/static`, and
  required `public` assets to the paths expected by the standalone server.
- Monorepo output paths **MUST** be discovered from actual build output;
  hard-coded assumptions about a root `.next` directory are prohibited.
- Runtime environment variables **MUST** remain runtime values. Any public
  browser variable is build-time embedded and **MUST** contain no secret.
- The server **MUST** bind to `0.0.0.0`, receive the platform port, run as a
  non-root user, and own only the paths it must write.

```dockerfile
FROM <PINNED_NODE_IMAGE> AS runtime
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000
WORKDIR /app
COPY --from=build --chown=10001:10001 /workspace/<APP>/.next/standalone ./
COPY --from=build --chown=10001:10001 /workspace/<APP>/.next/static \
  ./<APP>/.next/static
COPY --from=build --chown=10001:10001 /workspace/<APP>/public ./<APP>/public
USER 10001:10001
EXPOSE 3000
CMD ["node", "<APP>/server.js"]
```

## 9. NestJS and Prisma Images

- The build **MUST** generate the Prisma client deterministically before
  compiling code that imports it.
- Prisma binary targets and native engines **MUST** match the runtime operating
  system, architecture, libc, and OpenSSL ABI. Alpine and glibc images **MUST NOT**
  be interchanged without proving engine compatibility.
- The runtime **MUST** include the generated Prisma client, required engine or
  WebAssembly artifacts, schema when operational tools need it, compiled output,
  production dependencies, certificates, and declared assets.
- Production dependency pruning **MUST NOT** remove generated Prisma artifacts or
  packages loaded dynamically at runtime. The final image **MUST** be smoke-tested
  by loading the client and starting the compiled entry point.
- `start:prod` and `CMD` **MUST** target the actual emitted file; guessed paths
  such as `dist/main.js` are prohibited when the compiler emits elsewhere.
- Migration tooling **SHOULD** run in a dedicated release/job image or target.
  Application replicas **MUST NOT** race to run migrations at startup.

## 10. Static Go and Distroless Images

- Go builds **SHOULD** set an explicit target OS/architecture and use
  `CGO_ENABLED=0` only when every dependency supports a truly static build.
- Build metadata **SHOULD** be reproducible (`-trimpath`, controlled version
  injection, and no host paths). The binary **MUST** be built from the pinned
  module graph using verified module downloads.
- A static binary **SHOULD** run in `scratch` or a digest-pinned distroless static
  image. TLS clients **MUST** have CA certificates; applications using local time
  zones **MUST** include the required zone data.
- A CGO binary **MUST** use a compatible runtime libc and native libraries. It
  **MUST NOT** be placed in `scratch` merely to reduce size.
- Distroless images have no shell. Probes **MUST** use HTTP/TCP/gRPC or a purpose-
  built binary, not shell commands. Debugging **SHOULD** use ephemeral containers
  or a separately controlled debug image, never a shell added to production.

```dockerfile
# syntax=docker/dockerfile:1.7
FROM <PINNED_GO_IMAGE> AS build
ARG TARGETARCH
WORKDIR /src
COPY go.mod go.sum ./
RUN --mount=type=cache,id=gomod,target=/go/pkg/mod go mod download
COPY . .
RUN --mount=type=cache,id=gobuild,target=/root/.cache/go-build \
    CGO_ENABLED=0 GOOS=linux GOARCH=${TARGETARCH} \
    go build -trimpath -o /out/service ./cmd/<SERVICE>

FROM <PINNED_DISTROLESS_STATIC_IMAGE>
COPY --from=build --chown=65532:65532 /out/service /service
USER 65532:65532
EXPOSE 8080
ENTRYPOINT ["/service"]
```

## 11. Runtime Identity and Filesystem Security

- The runtime process **MUST** run as a dedicated non-root numeric UID/GID. The
  values **SHOULD** be stable and compatible with Kubernetes security contexts
  and mounted-volume ownership.
- Files **MUST** be copied with final ownership; recursive `chown` in a later
  layer **SHOULD** be avoided. Application files **SHOULD** be non-writable.
- Production workloads **SHOULD** use a read-only root filesystem. Required
  writable locations **MUST** be explicit `tmpfs`, `emptyDir`, or persistent
  mounts with size and lifecycle policy.
- Containers **MUST** drop all Linux capabilities and add back only a documented
  minimum. Binding privileged ports by adding `NET_BIND_SERVICE` **SHOULD** be
  avoided; use an unprivileged container port.
- Privilege escalation **MUST** be disabled. The runtime **SHOULD** use the
  platform default seccomp profile or a tested stricter profile; `unconfined` is
  prohibited without a documented exceptional need.
- Setuid/setgid binaries and package managers **SHOULD** be absent from runtime
  images. Docker socket mounts and privileged mode are prohibited for ordinary
  applications.

## 12. Process Contract, Signals, Ports, and Shutdown

- The application process **SHOULD** be PID 1 and **MUST** receive signals
  directly. Exec-form `ENTRYPOINT`/`CMD` is required; shell wrappers **MUST** use
  `exec` after necessary setup.
- Use `ENTRYPOINT` for a fixed executable and `CMD` for default arguments, or use
  `CMD` alone for an overridable application command. Their override contract
  **MUST** be intentional and documented.
- An init process **SHOULD** be supplied by the orchestrator when orphan reaping
  is needed. Bundling an init is acceptable only when portability requires it.
- The process **MUST** handle `SIGTERM`, stop accepting work, drain bounded work,
  close resources, and exit before the orchestrator's grace period. It **MUST**
  not rely only on `SIGKILL`.
- `STOPSIGNAL` **SHOULD** remain `SIGTERM` unless the runtime has a proven
  different contract.
- Services **MUST** listen on `0.0.0.0` or the required pod interface, not only
  loopback. Ports **MUST** be configurable and unprivileged.
- `EXPOSE` documents an intended container port; it does not publish or secure
  it. Published host ports **MUST** be limited to those actually needed.

## 13. Health Probes and Single Ownership

- Liveness **MUST** answer whether the process can continue. It **MUST NOT** fail
  merely because a database or optional upstream is unavailable.
- Readiness **MUST** answer whether the instance can receive traffic. Mandatory
  dependency checks **MUST** be bounded and must not amplify outages.
- Startup probes **SHOULD** protect legitimately slow initialization without
  weakening steady-state liveness thresholds.
- Probe endpoints **MUST** be cheap, unauthenticated only within the intended
  network boundary, and free of secrets or internal error details.
- Probe intervals, timeouts, failure thresholds, and shutdown grace periods
  **MUST** agree with measured startup and recovery behavior.
- The orchestrator **SHOULD** own probes. A Dockerfile `HEALTHCHECK` **SHOULD NOT**
  duplicate Kubernetes or another orchestrator's probes because divergent checks
  create two sources of truth. Add one only when standalone Docker portability
  requires it; then designate a single authoritative definition and generate or
  test the other against it.

## 14. Configuration and Secrets

- Images **MUST** be environment-neutral. Runtime configuration **MUST** be
  injected through environment variables, mounted files, or a platform config
  provider and validated by the application at startup.
- Secrets **MUST** use the platform secret mechanism and least-privilege access.
  File mounts are preferred when rotation or avoidance of environment exposure
  matters.
- Secrets **MUST NOT** appear in Dockerfiles, Compose files, image labels, build
  arguments, command-line arguments, logs, examples, or committed `.env` files.
- Examples **MUST** use unmistakable placeholders such as `<DATABASE_PASSWORD>`.
- Config and secret rotation behavior **SHOULD** be defined. The application must
  either reload safely or be rolled out deliberately.
- Docker Compose `env_file` is configuration convenience, not secret storage.

## 15. Compose: Development and Production

- Development and production Compose concerns **MUST** be separated with
  explicit files or profiles. Development bind mounts, source watchers, debug
  ports, and permissive commands **MUST NOT** leak into production.
- Services **MUST NOT** set `container_name`; generated project-scoped names allow
  scaling, parallel stacks, and collision-free CI.
- Networks **SHOULD** be private and purpose-specific. Only ingress-facing ports
  **SHOULD** be published; internal services communicate by service DNS name.
- Named volumes **SHOULD** hold local development state. Bind mounts **MUST** have
  deliberate paths, permissions, and read-only flags where possible.
- `depends_on` expresses startup ordering, not application readiness. A health
  condition may improve local sequencing, but applications **MUST** still retry
  transient dependency startup with bounded backoff.
- Production deployments **MUST NOT** rely on Compose `deploy` fields unless the
  selected runtime demonstrably enforces them. Resource limits **MUST** be set in
  the syntax honored by that runtime.
- Compose configuration **MUST** be rendered and reviewed with
  `docker compose config` before use.

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: runtime
    environment:
      APP_PORT: "3000"
      DATABASE_URL_FILE: /run/secrets/database_url
    secrets:
      - database_url
    ports:
      - "127.0.0.1:<HOST_PORT>:3000"
    read_only: true
    tmpfs:
      - /tmp:size=64m,mode=1777
    cap_drop:
      - ALL
    security_opt:
      - no-new-privileges:true
    depends_on:
      database:
        condition: service_healthy
    restart: unless-stopped

  database:
    image: <PINNED_DATABASE_IMAGE>
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/database_password
    secrets:
      - database_password
    volumes:
      - database-data:/var/lib/postgresql/data
    networks:
      - default
    healthcheck:
      test: ["CMD-SHELL", "<DATABASE_READY_COMMAND>"]
      interval: 5s
      timeout: 3s
      retries: 10

secrets:
  database_url:
    file: <LOCAL_FAKE_DATABASE_URL_FILE>
  database_password:
    file: <LOCAL_FAKE_DATABASE_PASSWORD_FILE>

volumes:
  database-data:
```

This example is for controlled local use. Production secrets and databases
**MUST** use the target platform's mechanisms.

## 16. Migrations, Databases, and State

- Database migrations **MUST** be a controlled release step or one-shot job with
  observable success, timeout, and failure behavior. They **MUST NOT** run in
  every web replica.
- A migration job **MUST** use the same application release digest and compatible
  migration artifacts as the rollout. It **MUST** be idempotent where the tool
  supports retries and prevent unsafe concurrent execution.
- Schema changes **MUST** support overlapping old and new application versions
  during rolling deployment. Destructive changes require expand, backfill, and
  contract phases.
- Databases, queues, and object storage **SHOULD** be external managed services in
  production. If containerized, their data **MUST** use durable storage with
  backup, restore, upgrade, and corruption-recovery procedures.
- Application containers **MUST** be disposable. Sessions, uploads, generated
  files, and job state **MUST NOT** depend on the writable container layer.
- Volume deletion **MUST** be an explicit destructive action; routine deployment
  commands **MUST NOT** remove persistent volumes.

## 17. Logs, Resources, and Monitoring

- Containers **MUST** log structured application events to stdout/stderr. They
  **MUST NOT** write unmanaged rotating log files inside the image filesystem.
- Secret and personal-data redaction remains the application's responsibility.
  Log drivers and collectors **MUST** have bounded storage and backpressure policy.
- Workloads **MUST** declare realistic CPU and memory requests/limits in the
  orchestrator. Compose development limits **SHOULD** approximate production
  constraints when testing resource behavior.
- Applications **MUST** behave predictably under CPU throttling and memory limits;
  heap sizes, worker concurrency, and graceful shutdown **SHOULD** be tuned.
- Monitoring stacks **MUST** use pinned images, authentication, least-privilege
  networks, durable storage where needed, and explicit retention/resource limits.
- Metrics exporters **MUST NOT** mount the Docker socket or host root filesystem
  unless that access is essential, read-only where possible, and risk-reviewed.
- Monitoring configuration **SHOULD** remain separate from application Compose
  configuration. Dashboard/provisioning changes **SHOULD** be version-controlled;
  credentials and live data **MUST NOT** be.

## 18. Multi-Architecture Builds

- Supported platforms **MUST** be explicit, typically `linux/amd64` and/or
  `linux/arm64`. Build and target platform arguments **MUST** be used correctly;
  build tools run on `BUILDPLATFORM`, artifacts target `TARGETOS/TARGETARCH`.
- Native Node modules, Prisma engines, and CGO binaries **MUST** be produced and
  tested for each target. Copying host-native artifacts into another architecture
  is prohibited.
- A manifest list **MUST** reference equivalent application versions and metadata
  across architectures. Every published platform image **MUST** pass a smoke test.
- Emulation **SHOULD** be limited because it can hide runtime differences and be
  slow. Native builders are preferred for native-heavy builds.
- Architecture-specific base digests **MUST** resolve under the declared manifest
  and remain covered by provenance and scanning.

## 19. Metadata, SBOM, Provenance, and Scanning

- Published images **MUST** carry OCI labels for source identifier, revision,
  version, creation time, licenses when known, and description. Labels **MUST NOT**
  expose credentials, internal paths, or mutable environment data.
- CI **SHOULD** generate an SPDX or CycloneDX SBOM and attach it to the image
  digest. Provenance attestations **SHOULD** identify the builder and immutable
  inputs without leaking secret parameters.
- Images **MUST** be scanned for operating-system and language vulnerabilities
  before release and continuously after publication. Policy **MUST** define
  severity, exploitability exceptions, owners, and remediation deadlines.
- Scanners **MUST** scan the final image for every platform, not only a build
  stage or source tree. Secret scanning **SHOULD** cover both context and layers.
- Image signatures **SHOULD** be keyless or use protected signing keys, bound to
  the digest, and verified by deployment policy.
- A scan result is not proof of safety. Minimal privileges, trusted inputs,
  patching, and runtime controls remain required.

## 20. CI Build, Push, and Deploy Policy

- CI **MUST** build with BuildKit from a reviewed commit in a clean context using
  immutable dependency inputs. Registry credentials **MUST** be short-lived and
  scoped to required repositories/actions.
- Pull requests **SHOULD** build and test without pushing a release tag. Trusted
  release workflows **MUST** push once, capture the resulting digest, attach
  metadata/attestations, and promote that digest.
- Tags are discovery aliases only. Deployment manifests **MUST** reference an
  immutable digest; mutable tags such as `main`, `stable`, or semantic versions
  **MUST NOT** be the deployment identity.
- CI **MUST NOT** rebuild the same revision independently for each environment.
  Rollback **MUST** select a previously verified digest.
- Remote caches **MUST** be scoped to prevent untrusted branches from poisoning
  privileged release builds. Secret-bearing layers must never be cached.
- Before push, CI **MUST** run relevant application tests, container build checks,
  final-image scans, and a non-root smoke start. Failed gates **MUST** block
  release unless an auditable exception policy applies.

## 21. Kubernetes Interoperability and Rollouts

- Images **MUST** work with arbitrary pod names, injected configuration, service
  DNS, a read-only root filesystem, dropped capabilities, and a numeric non-root
  security context.
- Images **SHOULD NOT** require Docker-specific APIs, Compose ordering, host
  networking, fixed host paths, or access to the Docker socket.
- Container ports, probes, lifecycle hooks, resource settings, and termination
  grace periods **MUST** agree with application behavior.
- Readiness **MUST** turn false before shutdown work that makes the instance
  unable to serve. A `preStop` delay **MUST NOT** substitute for correct signal
  handling and endpoint draining.
- Rollouts **MUST** account for startup duration, surge/unavailable settings,
  connection draining, queue consumers, scheduled jobs, and schema compatibility.
- Single-replica services **MUST** explicitly accept downtime or use a rollout
  strategy that can schedule overlap within available resources.
- A deployment **MUST NOT** use `:latest`, rely on image pull timing, or mutate an
  existing image tag to trigger rollout. The desired digest and revision metadata
  must change explicitly.

## 22. Testing and Verification

The agent **MUST** adapt commands to repository scripts and available tools. A
complete container change normally verifies:

```bash
docker buildx build --check -f <DOCKERFILE> <CONTEXT>
docker buildx build --load -t <LOCAL_TEST_TAG> -f <DOCKERFILE> <CONTEXT>
docker image inspect <LOCAL_TEST_TAG>
docker run --rm --read-only --cap-drop=ALL \
  --security-opt=no-new-privileges --user <UID>:<GID> \
  --tmpfs /tmp:rw,noexec,nosuid,size=64m <LOCAL_TEST_TAG>
docker compose -f <COMPOSE_FILE> config --quiet
<IMAGE_SCANNER> image <LOCAL_TEST_TAG>
```

- Dockerfiles **MUST** pass the configured linter and BuildKit validation.
- The final image **MUST** be inspected for user, command, entry point, exposed
  ports, labels, architecture, unexpected files, and size regressions.
- The image **MUST** start with only documented runtime configuration, bind the
  intended interface/port, become ready, serve a smoke request or perform its job,
  and terminate cleanly on `SIGTERM` within the grace period.
- Verification **MUST** prove required writable paths work under the intended
  read-only filesystem and numeric user. It **MUST** confirm the process cannot
  write application files or gain forbidden capabilities.
- Dependency failure tests **SHOULD** distinguish liveness from readiness.
- Multi-stage builds **SHOULD** be checked for absent build tools, source,
  credentials, caches, and development dependencies in the final image.
- Multi-architecture images **MUST** be built and smoke-tested on every supported
  target before release.
- Compose tests **SHOULD** recreate from an empty disposable project and verify
  persistence separately. Test cleanup **MUST NOT** remove unrelated volumes.
- The agent **MUST** inspect the final diff and report exact commands, results,
  skipped checks, and remaining risk. It **MUST NOT** claim a check passed when it
  did not run.

## 23. Completion Checklist

Before declaring Docker work complete, the agent **MUST** confirm:

### Discovery and artifact

- [ ] Build contexts, consumers, versions, platforms, outputs, commands, ports,
      probes, writable paths, and rollout constraints were identified.
- [ ] Base images and toolchains are approved and immutably pinned.
- [ ] The build is lockfile-frozen, multi-stage, reproducible, and minimal.
- [ ] The final image contains every required runtime artifact and no build-only
      dependencies, source secrets, caches, or local configuration.

### Security and runtime

- [ ] Build context, cache, secret mounts, SSH mounts, and logs cannot leak
      credentials.
- [ ] The process runs as a stable numeric non-root UID/GID with a read-only root
      filesystem, explicit writable mounts, dropped capabilities, no privilege
      escalation, and an enforced seccomp profile.
- [ ] Exec-form process startup, PID 1 behavior, signal handling, draining, port
      binding, and graceful termination were verified.
- [ ] Liveness, readiness, and startup semantics are distinct and have one probe
      owner.

### Delivery and operations

- [ ] Compose development features are separated from production configuration;
      networks, ports, volumes, resources, and dependency behavior are explicit.
- [ ] Migrations are a controlled one-shot release action and schema changes are
      safe during overlapping rollouts.
- [ ] Logs use stdout/stderr; state is external; resources, retention, backup,
      restore, and monitoring implications were considered.
- [ ] Each supported architecture was built and tested.
- [ ] OCI labels, SBOM, provenance, signatures, and vulnerability policy are
      satisfied for the release.
- [ ] CI pushes once, records the digest, and deployments promote that digest.
- [ ] Kubernetes security contexts, probes, resources, and rollout timing agree
      with the image contract.
- [ ] Lint, build, inspect, scan, smoke, health, and shutdown checks ran, or each
      omission and its risk was reported.

## 24. Prohibited Anti-Patterns

The agent **MUST NOT** introduce or preserve as a model:

- floating base images or deployment by mutable tag;
- unpinned package-manager/tool downloads or unverified remote install scripts;
- secrets in `ARG`, `ENV`, Compose YAML, layers, labels, logs, examples, or build
  context;
- copied host `node_modules`, Go binaries, Prisma engines, or native modules from
  the wrong platform;
- one-stage production images containing compilers, source, tests, caches, or
  development dependencies;
- root execution, privileged containers, Docker socket mounts, broad host mounts,
  `seccomp=unconfined`, `--cap-add=ALL`, or enabled privilege escalation;
- writable application trees or persistent state in the container layer;
- shell-form runtime commands, wrappers that fail to `exec`, or ignored signals;
- fixed container names, hostnames, IP addresses, or dependence on startup order;
- published database/monitoring ports without a demonstrated access need;
- `depends_on` treated as readiness or retries replaced by arbitrary sleeps;
- migrations run by every replica, development migration creation in production,
  or destructive schema changes incompatible with rolling versions;
- a Dockerfile `HEALTHCHECK` that conflicts with orchestrator probes;
- liveness checks that restart healthy processes during dependency outages;
- downloading application code at startup or rebuilding per environment;
- deployment from an unscanned, unsigned when policy requires signing, or
  untraceable image;
- Compose development mounts, debug ports, fake convenience credentials, or
  permissive security settings promoted to production;
- claims of reproducibility, security, portability, or successful verification
  unsupported by executed checks and inspected evidence.
