FROM    node:4

# Bundle app source
COPY . /app

RUN cd /app; npm install -g gulp
RUN cd /app; npm install -g bower

# Install app dependencies
RUN cd /app; npm install
RUN cd /app; bower install --allow-root

RUN cd /app; gulp build

EXPOSE  9653
