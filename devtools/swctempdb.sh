#!/bin/bash

# First agument is location of the swc-datastore directory.  Not required if running from the root ndb directory.

if [ $# -eq 0 ]; then
    SRCDIR=$(PWD)
else
    SRCDIR=$1
fi

echo $SRCDIR

docker run --name some-postgres -e POSTGRES_PASSWORD=pgsecret -v $SRCDIR/swc-datastore:/docker-entrypoint-initdb.d --rm -p 5432:5432 postgres
