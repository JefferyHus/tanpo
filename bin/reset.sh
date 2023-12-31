#!/bin/sh

# Prefix for your containers
prefix="tanpo-"

# Stop and remove containers
docker ps -a | grep "$prefix" | awk '{print $1}' | xargs -I {} docker stop {}
docker ps -a | grep "$prefix" | awk '{print $1}' | xargs -I {} docker rm {}

# Remove images
docker images | grep "$prefix" | awk '{print $3}' | xargs -I {} docker rmi {}

# Remove volumes
docker volume ls | grep "$prefix" | awk '{print $2}' | xargs -I {} docker volume rm {}
