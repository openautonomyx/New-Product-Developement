# Multi-Agent Product Development System Dockerfile
# Production-grade, SOC2 compliant, multi-tenant agent team

FROM python:3.11-slim

# Labels
LABEL maintainer="Autonomyx"
LABEL description="Multi-Agent Product Development System"
LABEL version="1.0.0"

# Environment
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PRODUCT_ENV=production

# Security: non-root user
RUN groupadd -r agent && useradd -r -g agent agent
RUN mkdir -p /app && chown -R agent:agent /app

WORKDIR /app

# Install dependencies
COPY pyproject.toml ./
RUN pip install --no-cache-dir -e . 2>/dev/null || pip install --no-cache-dir \
    fastapi \
    uvicorn \
    pydantic \
    python-jose \
    passlib \
    python-multipart \
    redis \
    kafka-python

# Copy application
COPY enterprise.py api.py ./
COPY multi_agent_system/ ./multi_agent_system/
COPY ui.html ./

# Expose ports
# - 8000: API
# - 3000: UI (via API /ui endpoint)
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

# Switch to non-root
USER agent

# Run with gunicorn for production
CMD ["python", "-m", "uvicorn", "enterprise:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]