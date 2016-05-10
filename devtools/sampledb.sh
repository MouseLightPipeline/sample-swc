#!/bin/bash

# First agument is location of the static-datastore directory.  Not required if running from the root ndb directory.

if [ $# -eq 0 ]; then
    SRCDIR=$(PWD)
else
    SRCDIR=$1
fi

echo $SRCDIR

docker run --name sample-db -e POSTGRES_PASSWORD=pgsecret -v $SRCDIR/sample-datastore:/docker-entrypoint-initdb.d --rm -p 5433:5432 postgres
