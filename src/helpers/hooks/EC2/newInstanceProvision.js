import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom'
import fx from "../../fx"

const useEC2NewInstanceProvision_hooks = () => {
    // ------- States ------
    const [checkpoint, setCheckpoint] = useState(1)
    const [fileReady, setFileReady]  = useState(false)
    const [userTampered, setUserTampered] = useState(false)
    const location=useLocation()    

    const instructions ={
        "1":{
            commands: {
              command: "docker",
              args: ["buildx", "build", "-t", location.state.data.instanceName, `./machine_images/${location.state.data.instanceName}`]
            },
            message: "[docker-vpc] ====== Building image from dockerfile.. ======"
            },
        "2":{
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
        "3": {
            commands: {
                command: "docker",
                args: ["start", location.state.data.instanceName],
            },
            message: "[docker-vpc] ====== Starting Instance.. ======"
            },
        "4" : {
            commands : {
                command: "",
                args : []
            },
            message: "[docker-vpc] Container provisioned succesfully!"
        }
    }    

    // ------- Event listeners ------
    useEffect(() => {
        if (userTampered) fx.base.exec(`./bin/instance_cleanup.sh ${location.state.data.instanceName}`)
    }, [userTampered])


    // ------- handlers ------
    const prepareDockerfile = async(data) => {
        try {
            const dockerfileLocation = `./machine_images/${data.instanceName}/Dockerfile`
            await fx.base.exec(`mkdir ./machine_images/${data.instanceName}`)
            await fx.base.exec(`touch ${dockerfileLocation}`)
            
            const dockerfile = 
`FROM ${data.image} 
LABEL name=${data.instanceName} 
LABEL cpu=${data.instanceType.vCPU} 
LABEL memory=${data.instanceType.memory} 
LABEL container_type=vm_instance 

# COPY PHASE 
# ADD PHASE 
${data.userScripts?.["ADD"].map(ins => `ADD ${ins[1]} ${ins[2]}`)}
# RUN PHASE (bootstrap scripts) 
${data.userScripts?.["RUN"].map(ins => `RUN ${ins[1]}`).join("\n")}

${data.allowHTTP ? "EXPOSE 80" : ""} 
${data.allowHTTPS ? "EXPOSE 443" : ""} 
${data.additionalPorts.map(port => `EXPOSE ${port}`)}

${data.entrypoint ? `CMD [${data.entrypoint.map(ent => `\\"${ent}\\"`).join(', ')}]` : ''}
`

            await fx.base.exec(`echo "${dockerfile}" > ${dockerfileLocation}`)
            setFileReady(true)            
        }
        catch {
            setUserTampered(true)
        }
    }

    return {
        checkpoint,
        fileReady,
        userTampered,
        instructions,
        prepareDockerfile,
        setCheckpoint,
        location
    }
}

export default useEC2NewInstanceProvision_hooks