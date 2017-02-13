#!/bin/bash

# First argument is location of the sample-datastore directory.  Not required if running from the root ndb directory.

if [ $# -eq 0 ]; then
    SRCDIR=$(PWD)
else
    SRCDIR=$1
fi

echo $SRCDIR

docker inspect sample-datastore

if [ $? -ne 0 ]; then
  docker create --name sample-datastore postgres
fi

docker inspect sample-db

if [ $? -ne 0 ]; then
    echo "Running new sample-db container"
    docker run -v $SRCDIR/sample-datastore:/docker-entrypoint-initdb.d --volumes-from sample-datastore -e POSTGRES_PASSWORD=pgsecret -p 5432:5432 -i --name sample-db postgres
else
    echo "Starting existing sample-db container"
    docker start sample-db -ai
fi

