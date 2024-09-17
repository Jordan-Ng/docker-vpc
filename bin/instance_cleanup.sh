#!/bin/bash
docker rm -f $1
docker rmi $1

images="$1"

for image in $images; do
    if [ -d "./machine_images/$image" ]; then
        rm -r "./machine_images/$image"
    fi
done