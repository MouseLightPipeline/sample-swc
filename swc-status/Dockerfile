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
RUN rm -rf /app/public/components

# Install production app dependencies
RUN cd /app; npm install -g --production bower
RUN cd /app; npm install --production
RUN cd /app; bower install --allow-root

EXPOSE  9652
