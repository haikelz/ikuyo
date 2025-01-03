FROM node:alpine AS build

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm install

COPY . ./
RUN npm run build 

FROM nginx:alpine AS runtime
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /user/share/nginx/html
EXPOSE 8080
