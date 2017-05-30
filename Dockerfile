FROM node:boron

RUN apt update && apt install -y python-pip
RUN pip install gcalcli
COPY .gcalcli_oauth /root

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app
RUN yarn install

COPY . /usr/src/app

CMD node index.js
