#!/bin/bash
cluster_proxy="${1}_traefik"

echo "Verifying Integration Target: $1"
if [ "docker inspect -f '{{.State.Running}}' $cluster_proxy" = "true" ]; then
    echo "$1 is online, moving on.."
    exit 0
else 
    # add handler for non existent containers
    echo "$1 is offline, booting up!"
    docker compose -p $1 start
    exit $?    
fi