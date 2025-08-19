##### Base Image
FROM node:lts AS base

# Production env (inherited)
ENV NODE_ENV=production
ENV PORT=3103

# Setup and install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

# Set working directory
WORKDIR /app

##### Prod Deps Image
FROM base AS prod-deps

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

##### Build Image
FROM base AS build

ADD . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

#### Prod Image
FROM base

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /myapp/package.json /myapp/package.json
COPY --from=build /app/build /app/build
EXPOSE 3103
CMD [ "pnpm", "start" ]
