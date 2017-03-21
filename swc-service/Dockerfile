FROM node:7.5

# Bundle app source
COPY . /app

# Remove development dependencies
RUN rm -rf /app/node_modules
RUN rm -rf /app/test

# Install production app dependencies
RUN cd /app; npm install

EXPOSE  9651

CMD ["node", "/app/app.js"]
