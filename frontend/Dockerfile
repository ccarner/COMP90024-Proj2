FROM node:alpine

RUN mkdir -p /usr/src/app
ENV PORT 3000

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app
COPY next.config.js /usr/src/app

# Production use node instead of root
# USER node

RUN yarn install --production

COPY . /usr/src/app

RUN export NODE_OPTIONS=--max_old_space_size=4096 yarn build

EXPOSE 3000
CMD export NODE_OPTIONS=--max_old_space_size=4096 yarn run start