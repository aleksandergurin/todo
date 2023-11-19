FROM node:lts-alpine AS dev
ENV NODE_ENV development

WORKDIR /opt/app

COPY package.json .
COPY package-lock.json .
COPY src ./src
COPY public ./public
RUN npm install
CMD npm start
