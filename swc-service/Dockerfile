FROM    ubuntu:wily

RUN     apt-get update

RUN     apt-get install -y curl

RUN     curl -sL https://deb.nodesource.com/setup_4.x | bash -

RUN     apt-get install -y nodejs

# Bundle app source
COPY . /app

# Remove development dependencies
RUN rm -rf /app/node_modules
RUN rm -rf /app/test

# Install production app dependencies
RUN cd /app; npm install --production

EXPOSE  9651
