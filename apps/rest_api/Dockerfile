FROM node:23-alpine3.20


WORKDIR /app

COPY package*.json ./

RUN npm i

COPY ./apps/rest_api .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]