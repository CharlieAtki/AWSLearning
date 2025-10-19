# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-slim AS base
WORKDIR /app

# Install dependencies using npm ci for deterministic builds
COPY --link package.json package.json
COPY --link package-lock.json package-lock.json
RUN --mount=type=cache,target=/root/.npm \
    npm ci --production

# Copy application source code (excluding .env, .git, lock files, IDE configs)
COPY --link controller/ controller/
COPY --link models/ models/
COPY --link routes/ routes/
COPY --link server.js server.js

# Set environment variables for production
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Create and use a non-root user for security
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

# Expose the port (commonly 3000 for Node.js, adjust if needed)
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
