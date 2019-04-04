FROM node:8.15.1-alpine

RUN apk add git

RUN mkdir /home/app \
    && cd /home/app \
    && git clone https://github.com/amirkeren/soccer-league.git

WORKDIR /home/app/soccer-league/soccer-league

COPY package*.json ./
RUN npm install

EXPOSE 80
CMD npm start