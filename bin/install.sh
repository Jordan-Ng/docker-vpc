#!/bin/bash
docker=/usr/local/bin/docker
colima=/usr/local/bin/colima

# check if docker previously installed
echo -e "\n===== Installing required packages ===="
if [ -f $docker ]
then 
    echo -e "docker installation exists, skipping .."
else
    echo -e "\n     ===== Installing Docker ====\n"
    sleep 2
    brew install docker
    # brew install docker-buildx
fi

# check if colima is installed (needed to create linux vm for docker)
if [ -f $colima ]
then
    echo -e "colima installation exists, skipping .."
else
    echo -e "\n     ===== Installing Colima ===== \n"
    sleep 2
    brew install colima
fi

sleep 2
 
echo -e "\n===== Starting linux vm for docker ===="
colima list | grep -i -E "Running.*docker" > /dev/null

if [ $? -eq 0 ]
then 
    echo -e "colima linux vm already started, skipping .."
else    
    colima start --cpu 4 --memory 10
fi

# testing docker hello world, suppressing standard output
echo -e "\n===== Testing Docker Installation ===="
docker run hello-world > /dev/null

if [ $? -eq 0 ]
then 
    echo -e "Result: Installation successful!\n"
    exit 0
else
    echo -e "Result: Installation process failed\n"
    exit 1
fi