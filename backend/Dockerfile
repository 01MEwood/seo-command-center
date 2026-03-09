FROM node:20-alpine
WORKDIR /app

# Install curl for Docker healthchecks
RUN apk add --no-cache curl openssl

# Dependencies first (cache layer)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev
RUN npx prisma generate

# Copy source
COPY . .

# Create logs directory
RUN mkdir -p logs

EXPOSE 4000

# Use node directly for proper signal handling (not npm start)
CMD ["node", "src/index.js"]
