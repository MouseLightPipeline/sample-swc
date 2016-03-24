FROM    ubuntu:wily

RUN     apt-get install -y curl

RUN     curl -sL https://deb.nodesource.com/setup_4.x | bash -

RUN     apt-get install -y nodejs

# Bundle app source
COPY . /app

# Remove development dependencies
RUN rm -rf /app/node_modules
RUN rm -rf /app/bower_components

# Install production app dependencies
RUN cd /app; npm install --production
RUN cd /app; bower install -production

EXPOSE  3000
