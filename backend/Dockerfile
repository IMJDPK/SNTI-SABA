FROM node:18-alpine

# Create base app directory
WORKDIR /app

# Copy the repository/context into the image (works for both repo-root and backend-root contexts)
COPY . /app

# Install dependencies where package.json actually lives
# - If building from repo root, install inside /app/backend
# - If building from backend/ as context, install in /app
RUN sh -c 'if [ -f /app/backend/package.json ]; then cd /app/backend && npm ci --omit=dev; elif [ -f /app/package.json ]; then cd /app && npm ci --omit=dev; else echo "No package.json found" && exit 1; fi'

# Expose backend port
EXPOSE 3001

# Start the application from the correct directory
CMD sh -c 'if [ -d /app/backend ]; then cd /app/backend; else cd /app; fi; node index.js'
