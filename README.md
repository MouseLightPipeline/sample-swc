# Neuron Data Browser Services
NDB is a collection of services for managing annotated neuron data.

## Usage
After installation the various services are available on dedicated ports of the host machine.  For example, the SWC file services are available in the 965x range.  The primary interface will be exposed on port 80.

## Architecture
The current vision is to separate the raw data sources from primary, interactive site.  For example, standard SWC files will be managed by a set of SWC services and stored in a database instance aligned with the raw data.  A similar set of resources would exist for additional sources, such as a custom format with additional annotations.

These raw sources will be transformed and collated into a combined repository/database that will back the generally available query service.

Some of the reasons and motivations:

* Original information for each type of source is stored in an unmodified form and organized optimally for the original content
* Any transformations to a common format in a separate database can be repeated as many times as necessary without resubmitting the original content
* Content from the "original" source databases can be collated into multiple "primary" repositories, for example a private internal and public external,  using different transformation rules and behaviors

## Installation
The current implementation uses Docker to manage the multiple independent services.  It has been tested on OS X and Linux (Ubuntu and CentOS).  Although individual containers will also work on Windows Docker installations, Docker Compose is not supported on Windows at the time of this writing.  Docker Compose simplifies launching the collection of services as a system.  OS X has only been tested with VMWare fusion as the host and not VirtualBox which is builtin/default with the OS X Docker installer.

### Docker Engine and Compose
Standard installation of Docker Enginge and Compose on Mac OS X and Linux  are sufficient.  Be sure to follow the instructions for installing the latest version of Compose.  Not all package repositories contain the latest version at the time of this writing.  Current minimum versions are:

*  Docker Engine v1.10.x
*  Docker Compose v1.6.x

If you are using OS X, you will also be using Docker Machine.  Docker Machine could be used if you are using a Linux host as well and want to separate from other Docker systems.

There is nothing unique to NDB and its use of Docker - follow standard Docker instructions for all aspects of Docker Engine, Compose, and Machine.

### Build and Run
From a native Linux host or a Docker Machine session in the root directory of the cloned repository (the root directory will contain the file ```docker-compose.yml```):

1. Stop the current services if running (ignore if first installation)
```
docker-compose stop
```

2. Build the custom images
```
docker-compose build
```
For the first build on a new host this will take some time.

3. Start the services
```
docker-compose up
```

Databases use Data Volume Containers.  The above procedure will not wipe existing data as listed, however there are variations of these commands that will remove containers and their associated volumes.  The data backup service should prevent a catastrophic loss, but use caution if modifying containers and volumes or using other Engine, Compose, or Machine commands.
