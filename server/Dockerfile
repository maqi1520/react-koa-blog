FROM node:12-alpine

WORKDIR /home/node/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 4000

CMD [ "npm", "run", "start" ]