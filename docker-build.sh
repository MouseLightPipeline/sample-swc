#!/usr/bin/env bash

cd sample-service && npm run docker-build && cd ../sample-web && npm run docker-build && cd ../swc-service && npm run docker-build && cd ../swc-web && npm run docker-build
