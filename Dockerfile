# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — Dependencies
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-bookworm-slim AS deps
WORKDIR /app

RUN apt-get update && apt-get install -y openssl wget && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including dev deps needed for prisma generate)
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Final production stage
FROM node:20-bookworm-slim AS production
WORKDIR /app

RUN apt-get update && apt-get install -y openssl wget && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

# Copy built app and ALL node_modules for now (to be safe and debug)
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Run as non-root user
RUN groupadd --system nestjs && useradd --system -g nestjs nestjs
USER nestjs

EXPOSE 3000

CMD ["npm","run","start:prod"]

