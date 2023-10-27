FROM node:18

WORKDIR /usr/src/eazyrooms_chat_history_service

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 3007

CMD ["node", "server.js"]