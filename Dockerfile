##### Base Image
FROM node:lts AS base

# Production env
ENV NODE_ENV=production

# Setup and install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

# Set working directory
WORKDIR /app

##### Build Image
FROM base AS build

ADD . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

#### Prod Image
FROM base

COPY --from=build /app/.output /app/.output
COPY --from=build /app/package.json /app/package.json

EXPOSE 3000
CMD [ "pnpm", "start" ]
