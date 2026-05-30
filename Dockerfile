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

# Install all workspace dependencies
RUN bun install --frozen-lockfile

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

# Stage 2: Create the lean production image
FROM oven/bun:1.3.9-slim

WORKDIR /app

# Copy the web app package.json
COPY --from=builder /app/apps/web/package.json ./package.json

# Copy root node_modules (contains workspace packages like @sephar/web3)
COPY --from=builder /app/node_modules ./node_modules

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
