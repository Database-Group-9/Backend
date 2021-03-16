FROM node:14

RUN mkdir -p /usr/src/backend/src

WORKDIR /usr/src/backend/src

COPY package*.json ./

RUN npm install

#RUN npm ci --only=production

#Bundle app source
COPY . .

EXPOSE 3001

CMD [ "node", "./src/bin/www"]