FROM    node:4

# Bundle app source
COPY ./initializer /app

# Remove development dependencies
RUN rm -rf /app/node_modules
RUN rm -rf /app/test

# Install production app dependencies
RUN cd /app; npm install --production
