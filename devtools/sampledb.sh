#!/bin/bash

# First argument is location of the sample-datastore directory.  Not required if running from the root ndb directory.

if [ $# -eq 0 ]; then
    SRCDIR=$(PWD)
else
    SRCDIR=$1
fi

echo $SRCDIR

docker run --name sample-db -e POSTGRES_PASSWORD=pgsecret -v $SRCDIR/sample-datastore:/docker-entrypoint-initdb.d --rm -p 5432:5432 postgres
