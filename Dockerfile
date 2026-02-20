# Stage 1: Build the SvelteKit application
FROM oven/bun:1 AS builder

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

# Write build-time env vars into the web app directory
RUN echo "DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy" > apps/web/.env && \
    echo "MINIO_ENDPOINT=localhost" >> apps/web/.env && \
    echo "MINIO_PORT=9000" >> apps/web/.env && \
    echo "MINIO_ACCESS_KEY=dummyaccesskey123" >> apps/web/.env && \
    echo "MINIO_SECRET_KEY=dummysecretkey123" >> apps/web/.env && \
    echo "MINIO_USE_SSL=false" >> apps/web/.env && \
    echo "MINIO_BUCKET=dummy-bucket" >> apps/web/.env && \
    echo "BETTER_AUTH_SECRET=dummy-secret-key-for-build-minimum-32-characters-long" >> apps/web/.env && \
    echo "BETTER_AUTH_URL=http://localhost:3000" >> apps/web/.env && \
    echo "NODE_ENV=production" >> apps/web/.env && \
    echo "EMAIL_WEBHOOK=https://email" >> apps/web/.env && \
    echo "BODY_SIZE_LIMIT=10485760" >> apps/web/.env

# Build the web app from its own directory
RUN cd apps/web && bun run build

# Stage 2: Create the lean production image
FROM oven/bun:1-slim

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

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run -e "fetch('http://localhost:3000').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Run the application
CMD ["bun", "run", "build/index.js"]
