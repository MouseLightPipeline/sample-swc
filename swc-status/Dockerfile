FROM    ubuntu:wily

RUN     apt-get update

RUN     apt-get install -y curl

RUN     apt-get install -y git

RUN     curl -sL https://deb.nodesource.com/setup_4.x | bash -

RUN     apt-get install -y nodejs

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

EXPOSE  9652
