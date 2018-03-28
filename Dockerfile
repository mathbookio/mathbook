FROM node:8.10.0-alpine

WORKDIR /app
COPY . /app

ARG NODE_ENV=local

ENV NODE_ENV=${NODE_ENV}

RUN npm i -g gulp-cli
RUN npm i
RUN gulp bundle

CMD [ "npm", "start" ]