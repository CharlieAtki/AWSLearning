# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-slim AS base
WORKDIR /app

# Install dependencies using npm ci for deterministic builds
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --production

# Copy application source code (excluding .env, .git, etc. via .dockerignore)
COPY controller/ ./controller/
COPY models/ ./models/
COPY routes/ ./routes/
COPY server.js ./

# Set environment variables for production
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Create and use a non-root user for security
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

# Expose the port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["node", "server.js"]