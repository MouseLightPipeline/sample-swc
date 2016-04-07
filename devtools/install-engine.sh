#!/bin/sh
apt-get update
apt-get install -y docker-engine
service docker start
docker run hello-world
usermod -aG docker $USER
sudo systemctl enable docker

# compose
curl -L https://github.com/docker/compose/releases/download/1.7.0-rc1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
