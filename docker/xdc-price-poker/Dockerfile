FROM node:16.13.0

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install

RUN apt-get update
RUN apt-get -y install jq

COPY xdc-price-poker/package.json /usr/src/app/package.json
COPY xdc-price-poker/yarn.lock /usr/src/app/yarn.lock
COPY xdc-price-poker/src/ /usr/src/app/src
COPY xdc-price-poker/scripts/ /usr/src/app/scripts

WORKDIR /usr/src/app

RUN yarn --no-progress --non-interactive --frozen-lockfile

CMD [ "./scripts/start_ecs.sh" ]