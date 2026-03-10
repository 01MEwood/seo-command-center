FROM node:20-alpine
RUN apk add --no-cache openssl curl
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy 2>/dev/null || npx prisma db push --accept-data-loss=false --skip-generate; node src/index.js"]
