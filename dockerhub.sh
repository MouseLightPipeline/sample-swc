#!/usr/bin/env bash

if [ "$#" -gt 0 ] &&  [ "$0" = "push" ]; then
    echo "building tagged docker containers"
    cd sample-service && npm run docker-push && cd ../sample-web && npm run docker-push && cd ../swc-service && npm run docker-push && cd ../swc-web && npm run docker-push
else
    echo "pushing tagged docker containers to hub"
    cd sample-service && npm run docker-build && cd ../sample-web && npm run docker-build && cd ../swc-service && npm run docker-build && cd ../swc-web && npm run docker-build
fi
