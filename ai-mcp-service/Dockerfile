# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-slim AS base
WORKDIR /app

# Install dependencies using npm ci for deterministic builds
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --production

# Copy application source code
COPY src/ ./src/

# Security: create and use a non-root user
RUN addgroup --system aiuser && adduser --system --ingroup aiuser aiuser
USER aiuser

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Health check (adjust based on your actual service)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "console.log('AI Service Running')" || exit 1

# Default command
CMD ["python3", "src/main.py"]