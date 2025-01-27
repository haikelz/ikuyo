FROM node:alpine AS build

RUN npm install -g pnpm
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY package.json pnpm-lock.yaml ./

WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install

COPY . ./
RUN pnpm run build 

FROM nginx:alpine AS runtime
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
