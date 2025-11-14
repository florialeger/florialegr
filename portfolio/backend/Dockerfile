# Use Debian-based slim image to make native builds (sharp) reliable
FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Install build deps required by some native modules (sharp)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    libvips-dev \
  && rm -rf /var/lib/apt/lists/*

# Copy dependency manifests first for better caching
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy app source
COPY . .

# Use a non-root user for security
RUN useradd --create-home appuser || true
RUN chown -R appuser:appuser /usr/src/app
USER appuser

ENV PORT=8080
EXPOSE 8080

# Start the server (serveur.jsx is the entrypoint)
CMD ["node", "serveur.jsx"]
