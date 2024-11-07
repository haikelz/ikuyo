FROM node:alpine AS build

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm install

COPY . ./
RUN npm run build 

CMD ["npm", "run", "dev"]