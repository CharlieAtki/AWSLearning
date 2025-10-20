# syntax=docker/dockerfile:1
ARG PYTHON_VERSION=3.12-slim
FROM python:${PYTHON_VERSION} AS base

# Create app directory
WORKDIR /app

# Install system dependencies (if any) and update pip
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    curl \
 && rm -rf /var/lib/apt/lists/* \
 && pip install --no-cache-dir --upgrade pip

# Install Python dependencies
COPY requirements.txt ./
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY src/ ./src/

# Create non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

# FastAPI defaults
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Default port for the agent service (align with backend AGENT_SERVER_URL=5050)
ENV PORT=5050
EXPOSE 5050

# Healthcheck: root endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -fsS http://localhost:${PORT}/ || exit 1

# Start FastAPI with uvicorn
CMD ["python", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "5050"]