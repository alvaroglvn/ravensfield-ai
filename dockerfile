# syntax = docker/dockerfile:1

ARG NODE_VERSION=20.19.4
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.5 --activate

# --- BUILD STAGE (Do everything here) ---
FROM base AS build
ENV NODE_ENV=development

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm-store \
    pnpm install --frozen-lockfile --store-dir /pnpm-store

COPY . .
RUN pnpm themes && pnpm css && pnpm build:web:optimized


# CRITICAL STEP: Remove devDependencies from this folder *after* building
RUN pnpm prune --prod

# --- RUNNER STAGE ---
FROM base AS runner
ENV NODE_ENV=production

# Copy the exact same node_modules we just built with
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

# Copy your specific backend files (preserving your previous logic)
COPY --from=build /app/src/services/AIGen/anthropic/system /app/src/services/AIGen/anthropic/system
COPY --from=build /app/src/utils/madlibs/generation/dictionaries /app/src/utils/madlibs/generation/dictionaries
COPY server.js /app/server.js

ENV PORT=8080
EXPOSE 8080
CMD ["node", "/app/server.js"]
