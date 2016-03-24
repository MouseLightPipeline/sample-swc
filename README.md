# Neuron Data Browser Services
NDB is a collection of services for managing annated neuron data.

## Installation
The current implementation uses Docker to manage the multiple independent services.  It has been tested on OS X and Linux (Ubuntu and CentOS).  Although individual containers will also work on Windows Docker installations, Docker Compose is not supported on Windows at the time of this writing.  Docker Compose simplifies launching the collection of services as a system.  OS X has only been tested with VMWare fusion as the host rather then VirtualBox.

### Docker Engine and Compose
Standard installation of Docker Enginge and Compose on Mac OS X and Linux  are sufficient.  Be sure to follow the instructions for installing the latest version of Compose.  Not all package repositories contain the latest version at the time of this writing.  Current minimum versions are:

*  Docker Engine v1.10.x
*  Docker Compose v1.6.x

If you are using OS X, you will be using of Docker Machine.  There is nothing unique to NDB and its use of Docker - follow standard Docker instructions for all aspects of Docker Engine, Compose, and Machine.

### Build and Run
From a native Linux host or a Docker Machine session in the root directory of the cloned repository (will contain the file docker-compose.yml:

1. Stop the current services if running (ignore if first installation)
```
docker-compose stop
```

2. Build the custom images
```
docker-compose build
```

3. Start the services
```
docker-compose up
```

Databases use Data Volume Containers.  The above procedure will not wipe existing data as listed, however there are variations of these commands that will remove containers and their associated volumes.  The data backup service should prevent a catastrophic loss, but use caution if modifying containers and volumes.
