FROM node:7.5

# Bundle app source
COPY . /app

RUN cd /app; npm install -g gulp bower

# Install app dependencies
RUN cd /app; npm install
RUN cd /app; bower install --allow-root

RUN cd /app; gulp build

EXPOSE  9653

CMD ["node", "/app/dist/server/app.js"]
