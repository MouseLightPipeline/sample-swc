#!/usr/bin/env bash

if [ "$#" -gt 0 ] &&  [ "$1" = "push" ]; then
    echo "pushing tagged docker containers to hub"
    cd sample-service && npm run docker-push && cd ../sample-web && npm run docker-push
else
    echo "building tagged docker containers"
    cd sample-service && npm run docker-build && cd ../sample-web && npm run docker-build
fi
