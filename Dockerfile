FROM python:3.11-slim

WORKDIR /app

# Install system dependencies if any are needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy all source files
COPY . .

# Expose port (Railway will override this with its own PORT env variable)
EXPOSE 8000

# Start Uvicorn, binding to 0.0.0.0 and using the dynamic PORT environment variable provided by Railway
CMD ["sh", "-c", "uvicorn backend.app:app --host 0.0.0.0 --port ${PORT:-8000}"]
