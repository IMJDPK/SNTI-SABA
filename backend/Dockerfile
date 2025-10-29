FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy application source
COPY . .

# Expose backend port
EXPOSE 3001

# Start the application
CMD ["node", "index.js"]
