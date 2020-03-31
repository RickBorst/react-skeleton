FROM mhart/alpine-node:12 AS build

WORKDIR /app

COPY ./package.json .
COPY ./yarn.lock .

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn lint
RUN yarn test
RUN yarn build

RUN yarn --production

FROM mhart/alpine-node:12

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]