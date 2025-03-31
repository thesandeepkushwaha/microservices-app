FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g pnpm@latest
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm install --frozen-lockfile
RUN pnpm run -r build

RUN pnpm deploy --filter=listener-service --prod /prod/listener-service 

RUN pnpm deploy --filter=receiver-service --prod /prod/receiver-service 

FROM base AS listener-service
COPY --from=build /prod/listener-service /prod/listener-service
WORKDIR /prod/listener-service
EXPOSE 3001
CMD [ "npm", "start" ]

FROM base AS receiver-service
COPY --from=build /prod/receiver-service /prod/receiver-service
WORKDIR /prod/receiver-service
EXPOSE 3000
CMD [ "npm", "start" ]