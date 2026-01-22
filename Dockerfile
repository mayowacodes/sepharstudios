# Stage 1: Build the SvelteKit application
FROM oven/bun:1 AS builder

# Set the working directory
WORKDIR /app

# Copy lockfile and package.json to leverage Docker cache
COPY bun.lock package.json ./

# Install dependencies with Bun
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Create a comprehensive .env file with ALL necessary dummy values for build
RUN echo "DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy" > .env && \
    echo "MINIO_ENDPOINT=localhost" >> .env && \
    echo "MINIO_PORT=9000" >> .env && \
    echo "MINIO_ACCESS_KEY=dummyaccesskey123" >> .env && \
    echo "MINIO_SECRET_KEY=dummysecretkey123" >> .env && \
    echo "MINIO_USE_SSL=false" >> .env && \
    echo "MINIO_BUCKET=dummy-bucket" >> .env && \
    echo "BETTER_AUTH_SECRET=dummy-secret-key-for-build-minimum-32-characters-long" >> .env && \
    echo "BETTER_AUTH_URL=http://localhost:3000" >> .env && \
    echo "NODE_ENV=production" >> .env && \
    echo "EMAIL_WEBHOOK=https://email" >> .env && \
    echo "BODY_SIZE_LIMIT=10485760" >> .env

# Modify vite.config to skip SSR during build (temporary workaround)
# Build with SSR disabled to prevent server code execution
RUN bun run build || (echo "Regular build failed, trying alternative..." && \
    sed -i 's/"build": "vite build"/"build": "vite build --ssr false"/g' package.json && \
    bun run build)

# If that fails too, try building without prerendering
RUN if [ ! -d "build" ]; then \
    echo "Attempting build without SSR compilation..." && \
    mkdir -p .svelte-kit && \
    echo '{"compilerOptions":{"target":"ES2020","module":"ES2020"}}' > .svelte-kit/tsconfig.json && \
    bun run build; \
    fi

# Stage 2: Create the final production image
FROM oven/bun:1-slim

# Set the working directory
WORKDIR /app

# Copy package.json
COPY --from=builder /app/package.json ./package.json

# Copy node_modules
COPY --from=builder /app/node_modules ./node_modules

# Copy the built application
COPY --from=builder /app/build ./build

# Copy package.json
COPY --from=builder /app/package.json ./

# Expose the port
EXPOSE 3000

# Set environment variables for production
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV ORIGIN=http://localhost:3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run -e "fetch('http://localhost:3000').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Run the application
CMD ["bun", "run", "build/index.js"]
