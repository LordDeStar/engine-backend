FROM node:23-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm i @prisma/client prisma@6.9.0

COPY ./apps/projects .

EXPOSE 3000

CMD npx prisma migrate dev --name init && npx prisma generate && npm run start:dev