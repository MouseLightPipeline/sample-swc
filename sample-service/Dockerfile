FROM    node:6

# Bundle app source
COPY . /app

# Remove development dependencies
RUN rm -rf /app/node_modules

# Install production app dependencies
RUN cd /app; npm install

EXPOSE  9641
