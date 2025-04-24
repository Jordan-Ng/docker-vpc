import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom'
import fx from "../../fx"

const useProvisionInstance_hooks = () => {
    // ------- States ------
    const [checkpoint, setCheckpoint] = useState(0)
    const [fileReady, setFileReady]  = useState(false)
    const [userTampered, setUserTampered] = useState(false)
    const [dockerfile, setDockerFile] = useState("")
    const location=useLocation()    

    const jobs =[
        {            
            commands: {
              command: "docker",
              args: ["buildx", "build" ,"-t", location.state.data.instanceName, `./machine_images/${location.state.data.instanceName}`]
            },
            message: "[docker-vpc] ====== Building image from dockerfile.. ======"
            },
        {
            
            commands : {
              command: "docker",
              args: ["container", "create", "-it", 
              ...location.state.data.network ? ["--network", location.state.data.network] : "" ,
              ...location.state.data.volume ? ["-v", `${location.state.data.volume}:/home/vol`] : "",
              ...location.state.data.portMappings.flatMap(mapObj => ['-p', `${mapObj.from}:${mapObj.to}`]),
              "--name", location.state.data.instanceName,             
              "--label", "type=virtual_instance" , location.state.data.instanceName]
            },
            message: "[docker-vpc] ====== Creating Container Instance.. ======"
        },        
        {
            commands : {
                command: "echo",
                args : [""]
            },
            message: "[docker-vpc] Container provisioned succesfully!"
        }
    ]  

    // ------- Event listeners ------
    useEffect(() => {
        if (userTampered) fx.base.exec(`./bin/instance_cleanup.sh ${location.state.data.instanceName}`)
    }, [userTampered])


    // ------- handlers ------
    const getDockerfile = async () => {
        const data = await fx.base.cat_file(`./machine_images/${location.state.data.instanceName}/Dockerfile`)
        
        if (data) {
            setDockerFile(data)
            return
        }
        setDockerFile("Unable to retrieve dockerfile")
    }
   

    return {
        checkpoint,
        fileReady,
        userTampered,
        jobs,
        dockerfile,        
        setCheckpoint,
        location,
        getDockerfile
    }
}

export default useProvisionInstance_hooks