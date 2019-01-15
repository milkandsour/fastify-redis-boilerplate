FROM node:10-alpine
WORKDIR /usr
COPY package*.json ./
RUN npm install --only=production
COPY ./src/server ./src/server
COPY ./server.yml ./
ENV SERVER_PORT 80
ENV LOG error
EXPOSE 80
CMD [ "npm", "start" ]
