# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.13.1

# Build stage
FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app

# Install dependencies
COPY --link package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy source files (excluding .env, .git, IDE, lock files, etc.)
COPY --link . .

# Build the frontend (assumes Vite or similar build tool)
RUN --mount=type=cache,target=/root/.npm \
    npm run build

# Production stage
FROM node:${NODE_VERSION}-slim AS final
WORKDIR /app

# Create non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy built assets and production dependencies only
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"
USER appuser

EXPOSE 4173  # Default Vite preview port; adjust if your app uses a different port

# Start the app (Vite preview by default; change if your app uses a different start command)
CMD ["npx", "vite", "preview", "--port", "4173", "--host"]
