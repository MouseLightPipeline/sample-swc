FROM    node:4

# Bundle app source
COPY . /app

# Remove development dependencies
RUN rm -rf /app/node_modules
RUN rm -rf /app/bower_components
RUN rm -rf /app/dist

# Install production app dependencies
RUN cd /app; npm install -g gulp
RUN cd /app; npm install -g bower
RUN cd /app; npm install
RUN cd /app; bower install --allow-root

RUN cd /app; gulp build

EXPOSE  9643
