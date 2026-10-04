FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/front/package.json apps/front/package.json
RUN npm ci

COPY apps/front ./apps/front
WORKDIR /app/apps/front
ENV VITE_API_BASE_URL=/api
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/apps/front/dist /usr/share/nginx/html
COPY apps/front/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80