##### Base Image
FROM node:lts AS base

# Production env (inherited)
ENV NODE_ENV=production

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
RUN pnpm prisma generate
RUN pnpm run build

#### Prod Image
FROM base

ARG USER_ID=1000
ARG GROUP_ID=1000
RUN groupadd -g ${GROUP_ID} appuser && \
    useradd -u ${USER_ID} -g appuser -m appuser
    
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/build /app/build
COPY database /app/database

RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 3000
CMD [ "sh", "-c", "pnpm prisma migrate deploy && pnpm start" ]
