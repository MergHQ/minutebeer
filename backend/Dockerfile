FROM node:14-alpine

ENV YARN_CACHE_FOLDER=/dev/shm/yarn-cache

WORKDIR /app

RUN npm install --global yarn@1.10.1

COPY yarn.lock package.json /app/
RUN yarn --dev --frozen-lockfile
RUN yarn global add typescript ts-node

COPY . /app/

CMD ["yarn", "start"]
