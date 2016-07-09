#!/bin/bash

# First argument is location of the neuron-datastore directory.  Not required if running from the root ndb directory.

if [ $# -eq 0 ]; then
    SRCDIR=$(PWD)
else
    SRCDIR=$1
fi

echo $SRCDIR

docker run --name ndb-db -e ARANGO_ROOT_PASSWORD=arsecret --rm -p 8529:8529 -v $SRCDIR/ndb-datastore/foxx:/var/lib/arangodb-apps/ arangodb/arangodb
