# base node image
FROM node:22-bookworm-slim AS base

ENV NODE_ENV production
RUN corepack enable

# all deps
FROM base AS deps

WORKDIR /app

COPY pnpm-lock.yaml ./
RUN pnpm fetch --prod false

# prod deps
FROM deps AS prod-deps

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --offline --frozen-lockfile

# build
FROM deps AS build

WORKDIR /app

COPY . ./
RUN pnpm install --prod false --offline --frozen-lockfile
RUN pnpm build

# production image
FROM base

WORKDIR /app

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/package.json /app/package.json

EXPOSE 3000
CMD ["pnpm", "start"]
