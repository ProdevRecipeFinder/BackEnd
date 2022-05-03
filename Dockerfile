#Node version to use
FROM node:14

#Environment
ENV NODE_ENV=production

#App dir
WORKDIR /usr/src/App

#App Dependencies
COPY package.json ./
COPY yarn.lock ./

#Install app deps if changed
RUN yarn

#Bundle source
COPY . .
COPY .env.production .env

#Build js project
RUN yarn build



EXPOSE 8080
CMD ["node", "dist/index.js"]
USER node