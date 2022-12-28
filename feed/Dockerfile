FROM node:16-alpine3.15

# Create app directory
WORKDIR /usr/src/app

COPY ./package*.json ./
COPY ./tsconfig.json ./

RUN npm install
# Bundle app source
COPY . .
RUN npm install typescript -g
RUN tsc
RUN ls | grep -v 'node_modules' | grep -v *.js | grep -v config.json | xargs rm -rf
CMD [ "node", "./app.js" ]