#!/bin/bash

docker run --name some-postgres -e POSTGRES_PASSWORD=pgsecret -v $(PWD)/../swc-datastore:/docker-entrypoint-initdb.d --rm -p 5432:5432 postgres
