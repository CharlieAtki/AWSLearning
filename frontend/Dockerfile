# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.13.1

# Build stage
FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy source files (excluding .env, .git, IDE, lock files, etc.)
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY eslint.config.js ./

# Build the frontend (Vite)
RUN npm run build

# Production stage
FROM node:${NODE_VERSION}-slim AS final
WORKDIR /app

# Create non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Install a simple HTTP server for serving static files
RUN npm install -g serve

# Copy built assets from builder
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist

ENV NODE_ENV=production
USER appuser

EXPOSE 4173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4173', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Serve the static files
CMD ["serve", "-s", "dist", "-l", "4173"]