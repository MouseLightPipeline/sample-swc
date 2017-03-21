#!/usr/bin/env bash

COMPOSE_FILE="docker-compose.yml"
PROJECT_NAME="ndblegacy"

if [ "$#" -gt 0 ]; then
  echo "Tearing down test environment"
  COMPOSE_FILE="docker-compose-test.yml"
  PROJECT_NAME="testndblegacy"
else
    echo "Tearing down production environment"
fi

docker-compose -f ${COMPOSE_FILE} -p ${PROJECT_NAME} down
