FROM node:alpine AS build

RUN npm install -g pnpm
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# apps
COPY apps/web/package.json ./apps/web/package.json

# packages
COPY packages/typescript/package.json ./packages/typescript/package.json

COPY package.json pnpm-lock.yaml .npmrc ./

RUN pnpm install

COPY . ./
RUN pnpm web build 

FROM nginx:alpine AS runtime
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
