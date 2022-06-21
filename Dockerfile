FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --only=production

COPY dist .

RUN ls -a

EXPOSE 4000

CMD ["node", "main.js"]
