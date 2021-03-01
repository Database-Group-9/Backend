FROM node:14

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install

#RUN npm ci --only=production

#Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js"]