#!/bin/bash
colima status &> /dev/null

if [ $? -eq 0 ]
then
    echo "Colima VM running. good to go!"
    
else 
    echo "Colima VM not running. Starting Colima.."
    colima start &> /dev/null
    echo "Docker is now running!"
    
fi

exit 0