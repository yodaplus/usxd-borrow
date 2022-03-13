FROM node:16.13.0

COPY xdc-price-poker/package.json /usr/src/app/package.json
COPY xdc-price-poker/yarn.lock /usr/src/app/yarn.lock
COPY xdc-price-poker/src/ /usr/src/app/src

WORKDIR /usr/src/app

RUN yarn --no-progress --non-interactive --frozen-lockfile

CMD [ "npm", "run", "start" ]