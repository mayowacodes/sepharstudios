# Stage 1: Build the SvelteKit application
FROM oven/bun:1.3.9 AS builder

WORKDIR /app

# Copy ALL workspace package.json files before installing so bun can
# resolve workspace:* dependencies (e.g. @sephar/web3)
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/
COPY packages/web3/package.json ./packages/web3/
COPY packages/shared/package.json ./packages/shared/
COPY packages/contracts/package.json ./packages/contracts/

# Install all workspace dependencies.
#
# --linker=hoisted is CRITICAL on Bun 1.3+: isolated installs became the
# workspace default, which turns apps/web/node_modules/* into symlinks
# aimed at the root node_modules/.bun store via relative paths
# (../../../node_modules/.bun/...). The stage-2 COPY below relocates
# those symlinks to /app/node_modules where the same relative path
# resolves past the filesystem root — every package dangles and the
# server dies with ERR_MODULE_NOT_FOUND (drizzle-orm was the first
# casualty). Hoisted mode produces real directories, which survive the
# copy-merge exactly as they did before the Bun 1.3 upgrade.
RUN bun install --frozen-lockfile --linker=hoisted

# Copy all source code
COPY . .

# Build-time env vars. SvelteKit's `$env/dynamic/private` reads from process.env
# during prerender analysis, NOT from .env files, so we set ENV explicitly.
# These are dummy placeholders — runtime values come from Dokploy's Environment
# tab and are injected via the container's env when the service starts.
ENV DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
ENV MINIO_ENDPOINT=localhost
ENV MINIO_PORT=9000
ENV MINIO_ACCESS_KEY=dummyaccesskey123
ENV MINIO_SECRET_KEY=dummysecretkey123
ENV MINIO_USE_SSL=false
ENV MINIO_BUCKET=dummy-bucket
ENV BETTER_AUTH_SECRET=dummy-secret-key-for-build-minimum-32-characters-long
ENV BETTER_AUTH_URL=http://localhost:3000
ENV EMAIL_WEBHOOK=https://email
ENV BODY_SIZE_LIMIT=10485760

# Build the web app from its own directory
RUN cd apps/web && bun run build

# With --linker=hoisted and no version conflicts, Bun hoists EVERYTHING
# to the root node_modules and never creates apps/web/node_modules at
# all — and Docker COPY hard-fails on a missing source dir. Guarantee
# it exists (empty is fine; the stage-2 merge just becomes a no-op).
RUN mkdir -p apps/web/node_modules

# Stage 2: Create the lean production image
FROM oven/bun:1.3.9-slim

WORKDIR /app

# Copy the web app package.json
COPY --from=builder /app/apps/web/package.json ./package.json

# Copy root node_modules (contains workspace packages like @sephar/web3)
COPY --from=builder /app/node_modules ./node_modules

# Some packages (drizzle-orm, svelte, better-auth, etc.) are stored in the
# app's local node_modules rather than hoisted to root. Merge them so the
# server can resolve them at runtime. Overwrites of same-version duplicates
# in the root are harmless.
COPY --from=builder /app/apps/web/node_modules ./node_modules

# Fail the BUILD (not production at 3am) if the runtime deps didn't
# survive the copy-merge as resolvable modules. `test -e package.json`
# inside the package dir follows symlinks, so a dangling link fails too.
RUN test -e node_modules/drizzle-orm/package.json \
	&& test -e node_modules/postgres/package.json \
	&& test -e node_modules/better-auth/package.json \
	|| (echo "FATAL: runtime node_modules are missing or dangling after copy-merge — check the --linker=hoisted install in the builder stage" && exit 1)

# Copy the built application (adapter-node output)
COPY --from=builder /app/apps/web/build ./build

# Expose the port
EXPOSE 3000

# Set runtime environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV ORIGIN=http://localhost:3000

# Health check — hits the real readiness endpoint that verifies DB + MinIO
# reachability, not just "the Node process is up".
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD bun run -e "fetch('http://localhost:3000/api/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Run the application
CMD ["bun", "run", "build/index.js"]
