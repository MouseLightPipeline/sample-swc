FROM    node:4

# Bundle app source
COPY . /app
COPY ./shared /shared

RUN cd /app; npm install -g gulp
RUN cd /app; npm install -g bower

# Install shared dependencies
RUN cd /shared; npm install
RUN cd /shared; bower install --allow-root

RUN cd /shared; gulp deploy

# Install app dependencies
RUN cd /app; npm install
RUN cd /app; bower install --allow-root

RUN cd /app; gulp build

EXPOSE  9653
