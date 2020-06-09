FROM node:14.2.0-alpine3.10

WORKDIR /home/node/node-mock-server
COPY . .

RUN npm ci --only=production
CMD [ "node", "docker/index.js" ]

EXPOSE 3001
