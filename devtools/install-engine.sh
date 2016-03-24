#!/bin/sh
apt-get update
apt-get install -y docker-engine
service docker start
docker run hello-world
usermod -aG docker $USER