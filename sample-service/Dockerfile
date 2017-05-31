FROM node:7.10

WORKDIR /app

# Bundle app source
COPY . .

# Install production app dependencies
RUN yarn global add typescript

RUN yarn install

EXPOSE  9641

CMD ["node", "/app/app.js"]
