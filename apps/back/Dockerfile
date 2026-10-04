FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/back/package.json apps/back/package.json
RUN npm ci

COPY apps/back ./apps/back
WORKDIR /app/apps/back
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine
WORKDIR /app/apps/back

COPY --from=builder /app/node_modules ./../../node_modules
COPY --from=builder /app/apps/back/node_modules ./node_modules
COPY --from=builder /app/apps/back/dist ./dist
COPY --from=builder /app/apps/back/generated ./generated
COPY --from=builder /app/apps/back/prisma ./prisma
COPY --from=builder /app/apps/back/package.json ./package.json

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/server.js"]