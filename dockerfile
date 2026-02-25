# syntax = docker/dockerfile:1

ARG NODE_VERSION=20.19.4
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
RUN corepack enable
RUN corepack prepare pnpm@9.15.5 --activate

FROM base AS build
ENV NODE_ENV=development

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm css
RUN pnpm exec expo export -p web

# --- NEW: Prune dependencies here, while we have the context ---
RUN pnpm prune --prod

FROM base AS runner
ENV NODE_ENV=production

# Copy the config files just in case (good practice), but we rely on the copied node_modules
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# --- CHANGED: Don't install. Copy the cleaned node_modules from build ---
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY --from=build /app/src/services/AIGen/anthropic/system /app/src/services/AIGen/anthropic/system
COPY server.js /app/server.js

ENV PORT=8080
EXPOSE 8080

CMD ["node", "/app/server.js"]
