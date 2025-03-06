import React, {useState, useEffect} from "react"
import { useLocation } from "react-router-dom"
import fx from "../../fx"

const useEC2ProvisionLB_hooks = () => {
    const [checkpoint, setCheckpoint] = useState(1)
    const [dockerCompose, setDockerCompose] = useState(undefined)
    const [fileReady, setFileReady] = useState(false)
    const location=useLocation()

    const instructions = {
        '1': {
            commands: {
                command: "echo",
                args: ["[docker-vpc] ====== Preparing Configuration File ======"]
            },
            message: ""
        },
        '2': {
            commands: {
                command: "echo",
                args: ["[docker-vpc] ====== Creating Load Balancer Service ======"]
            },
            message: ""
        },
        '3': {
            commands: {
                command: "docker",
                args: ["compose" ,"-f", `./compose_files/${location.state?.data.name}/docker-compose.yml`, "up", "-d", "--no-recreate"]
            },
            message: "[docker-vpc] ====== Starting Load Balancer Service ======"
        },
        '4': {
            commands: {
                command: "",
                args: []
            },
            message: "[docker-vpc] ====== Load Balancer Provisioned Successfully !======"
        }

    }

    // ------ handlers ------
    const cat_dockerComposeFile = async() => {
        fx.base.exec(`cat ./compose_files/${location.state.data.name}/docker-compose.yml`)
        .then(dataObj => {
            if (dataObj.exitStatus == 0)setDockerCompose(dataObj.out)
        })
    }

    const prepareDockerComposeFile = async(data) => {
        try{
            const composeFileLocation = `./compose_files/${data.name}/docker-compose.yml`
            await fx.base.exec(`mkdir ./compose_files/${data.name}`)
            await fx.base.exec(`touch ${composeFileLocation}`)

            const composeFile =
`
services:
    traefik:
        image: traefik
        container_name: ${data.name}_traefik
        command: --providers.docker
        ports:
            - ${data.behind_reverse_proxy ? "80" : "80:80"} 
        volumes:
            - /var/run/docker.sock:/var/run/docker.sock
        networks:
            - tg-network
    
    ${new Array(data.no_of_replicas).fill(0).map((_,i) => (
    `${data.machine_image}-${i+1}:
        image: ${data.machine_image}
        container_name: ${data.name}_${data.machine_image}-${i+1}
        networks:
            - tg-network
        labels:
            - "traefik.http.routers.${data.machine_image}.rule=Host(\`localhost\`)"
            - "traefik.http.services.${data.machine_image}.loadbalancer.server.port=${data.port}"
    `
    )).join('\n    ')}

networks:
    tg-network:
        driver: bridge
` 
        await fx.base.exec(`echo '${composeFile}' > ${composeFileLocation}`)
        setFileReady(true)
        }
        catch(err){
            console.log(err)
        }
    }

    return {prepareDockerComposeFile, fileReady, cat_dockerComposeFile, instructions, checkpoint, setCheckpoint, location, dockerCompose}
}

export default useEC2ProvisionLB_hooks