FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/back/package.json apps/back/package.json
RUN npm ci

COPY apps/back ./apps/back
WORKDIR /app/apps/back
ENV DATABASE_URL="mysql://placeholder:placeholder@localhost:3306/placeholder"
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/back/dist ./apps/back/dist
COPY --from=builder /app/apps/back/generated ./apps/back/generated
COPY --from=builder /app/apps/back/prisma ./apps/back/prisma
COPY --from=builder /app/apps/back/package.json ./apps/back/package.json

WORKDIR /app/apps/back
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/server.js"]