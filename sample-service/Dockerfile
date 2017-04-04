FROM node:7.5

WORKDIR /app

# Bundle app source
COPY . .

# Install production app dependencies
RUN npm install -g yarn typescript

RUN yarn install

EXPOSE  9641

CMD ["node", "/app/app.js"]
