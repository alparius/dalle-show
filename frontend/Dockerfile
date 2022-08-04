FROM node:lts-slim

EXPOSE 3000

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install

WORKDIR /app
COPY . /app

CMD npm start
