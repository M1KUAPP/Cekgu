FROM oven/bun:1.4.2 AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --ignore-scripts
COPY tsconfig.json vite.config.ts ./
COPY apps/ ./apps/
COPY public/ ./public/
RUN bun run build

FROM oven/bun:1.4.2 AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production --ignore-scripts
COPY apps/ ./apps/
COPY drizzle/ ./drizzle/
COPY --from=build /app/dist/client ./dist/client
EXPOSE 8080
CMD ["bun", "apps/server/index.ts"]
