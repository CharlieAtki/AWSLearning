# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-slim AS base
WORKDIR /app

# Install dependencies using npm ci for deterministic builds
COPY --link package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --production

# Copy application source code (excluding .env, .git, etc. via .dockerignore)
COPY --link src ./src

# Security: create and use a non-root user
RUN addgroup --system aiuser && adduser --system --ingroup aiuser aiuser
USER aiuser

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Default command (adjust if your entrypoint is different)
CMD ["node", "src/mcp/server.js"]
