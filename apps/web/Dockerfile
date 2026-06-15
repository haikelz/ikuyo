#syntax=docker/dockerfile:1
FROM oven/bun:1-alpine AS builder

WORKDIR /app

ENV CYPRESS_INSTALL_BINARY=0
ENV ASTRO_TELEMETRY_DISABLED=1

COPY package.json bun.lock tsconfig.json tsconfig.base.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/biome/package.json packages/biome/package.json
COPY packages/typescript/package.json packages/typescript/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN --mount=type=cache,id=bun-install-cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

COPY apps/web apps/web
COPY packages packages

RUN --mount=type=secret,id=web_env,target=/tmp/web_env,mode=0444 \
    cd apps/web && bunx dotenvx run -f /tmp/web_env -- bun run build

FROM golang:1.23-alpine AS static-server

WORKDIR /src

COPY apps/web/static-server.go ./

RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /ikuyo-server static-server.go

FROM scratch AS runner

COPY --from=static-server /ikuyo-server /ikuyo-server
COPY --from=builder /app/apps/web/dist/ /srv/

USER 65532:65532

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD ["/ikuyo-server", "healthcheck"]

ENTRYPOINT ["/ikuyo-server"]
