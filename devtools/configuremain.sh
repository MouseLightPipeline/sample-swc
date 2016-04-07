#!/bin/bash

# First agument is location of the main-datastore directory.  Not required if running from the root ndb directory.

if [ $# -eq 0 ]; then
    SRCDIR=$(PWD)
else
    SRCDIR=$1
fi

echo $SRCDIR

docker run --name some-node --rm -v $SRCDIR/main-datastore/initializer:/app -w /app node:4 node app.js

