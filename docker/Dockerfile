FROM node:lts-alpine

WORKDIR /app

COPY package.json .
COPY vacancy/package.json vacancy/
COPY common/package.json common/

# prod
# RUN npm i --only=prod -w vacancy -w common

# dev
RUN npm i -w vacancy -w common

COPY vacancy vacancy
COPY common common

CMD npm start -w vacancy