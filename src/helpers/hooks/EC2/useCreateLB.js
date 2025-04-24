import React, {useState, useEffect} from 'react'
import fx from '../../fx'
import { useNavigate } from 'react-router-dom'

const useCreateLB_hooks =() => {
    const [machineImages, setMachineImages] = useState([])    
    const navigate = useNavigate()
    const [lbSummary, setLbSummary] = useState({
        name: undefined,
        is_behind_reverse_proxy : false,
        machine_image: undefined,
        port: undefined,
        no_of_replicas: 1
    })


    const onFieldChange = (field, value) => {
        setLbSummary({
            ...lbSummary,
            [field] : value
        })
    }

    const populateMachineImages = async () => {
        const data = await fx.ec2.list_created_machine_images()
        if (data) {            
            setMachineImages(JSON.parse(data))  
            return
        }
        fx.base.notify("No Machine Images Found. Please create one via EC2/CreateInstance", "info", 3000)
    }

    const handleSubmit = async () => {        
        navigate('/load-balancer/create/new', {            
            state: await prepareDockerComposeFile(lbSummary)
        })
    }

    const prepareDockerComposeFile = async (data) => {
        try{
            const composeFileLocation = `./compose_files/lb-${data.name}/docker-compose.yml`
            await fx.base.exec(`mkdir ./compose_files/lb-${data.name}`)
            await fx.base.exec(`touch ${composeFileLocation}`)


        const composeFile =
`
services:
    traefik:
        image: traefik
        container_name: lb-${data.name}_traefik
        command: 
            - --providers.docker
            - --providers.docker.endpoint=unix:///var/run/docker.sock
            - --providers.docker.exposedbydefault=false
            - --providers.docker.constraints=Label(\`traefik.cluster\`, \`${data.name}\`)
            - --accesslog
        ports:
            - ${data.is_behind_reverse_proxy ? "80" : "80:80"} 
        volumes:
            - /var/run/docker.sock:/var/run/docker.sock
        networks:
            - tg-lb-${data.name}-network
            - tg-lb-${data.name}-link
        labels:
            - "traefik.enable=true"
            - "traefik.cluster=${data.name}"
    
    ${new Array(data.no_of_replicas).fill(0).map((_,i) => (
    `${data.machine_image}-${i+1}:
        image: ${data.machine_image}
        container_name: lb-${data.name}_${data.machine_image}-${i+1}
        networks:
            - tg-lb-${data.name}-network
        labels:
            - "traefik.http.routers.${data.machine_image}.rule=PathPrefix(\`/\`)"
            - "traefik.http.services.${data.machine_image}.loadbalancer.server.port=${data.port}"
            - "traefik.enable=true"
            - "traefik.cluster=${data.name}"
    `
    )).join('\n    ')}

networks:
    tg-lb-${data.name}-link:
        driver: bridge
        
    tg-lb-${data.name}-network:
        driver: bridge
` 
        await fx.base.exec(`echo '${composeFile}' > ${composeFileLocation}`)        
        return {
            folderPath: `./compose_files/lb-${data.name}`,
            filePath: `./compose_files/lb-${data.name}/docker-compose.yml`,
            composeFile,            
        }
        }
        catch(err){
            console.log(err)
        }
    }

    return {lbSummary, populateMachineImages, machineImages, onFieldChange, handleSubmit}
}

export default useCreateLB_hooks