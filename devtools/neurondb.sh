#!/bin/bash

# First argument is location of the neuron-datastore directory.  Not required if running from the root ndb directory.

if [ $# -eq 0 ]; then
    SRCDIR=$(PWD)
else
    SRCDIR=$1
fi

echo $SRCDIR

docker run --name neuron-db -e POSTGRES_PASSWORD=pgsecret -v $SRCDIR/neuron-datastore:/docker-entrypoint-initdb.d --rm -p 5434:5432 postgres
