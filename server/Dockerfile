FROM node:12

WORKDIR /usr/src/app

# use npm
# COPY package*.json ./

# use yarn
COPY yarn.lock ./
RUN yarn

COPY . .

ENV NODE_ENV=production

ENV PORT=4000

EXPOSE 4000
CMD ["yarn", "start"]
