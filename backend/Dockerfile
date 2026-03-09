FROM node:20-alpine
WORKDIR /app

# Install curl for healthchecks + openssl for Prisma
RUN apk add --no-cache curl openssl openssl-dev

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

CMD ["node", "src/index.js"]
