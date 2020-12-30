FROM node:14-alpine

WORKDIR /app

COPY yarn.lock package.json tsconfig.json knexfile.js /app/
COPY ./src /app/src
COPY ./migrations /app/migrations
RUN yarn --dev
RUN yarn build

CMD ["yarn", "start"]
