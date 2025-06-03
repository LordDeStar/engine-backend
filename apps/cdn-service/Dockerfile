FROM node:23-alpine3.20

WORKDIR /app

RUN npm init -y
RUN npm i express cors multer archiver

COPY . .

EXPOSE 3000

CMD [ "node", "server" ]