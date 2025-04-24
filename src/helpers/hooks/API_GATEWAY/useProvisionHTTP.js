import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom'
import fx from "../../fx"

const useProvisionHTTP_hooks = () => {   
    const [checkpoint, setCheckpoint] = useState(0) 
    const [composeFile, setComposeFile] = useState("")
    const [traefikConfigFile, setTraefikConfigFile] = useState("")
    const [isFileReady, setIsFileReady] = useState(false)
    const location = useLocation()
    const [summary, setSummary] = useState(undefined)    

    const jobs = [
        {
            type : "fx",
            job: async (stdout) => {return await prepareComposeFile(stdout);},
            message: "[docker-vpc] ====== Preparing Project Workspace ======"
        },
        {
            type : "fx",
            job: async (stdout) => (await scaffoldTraefikConfigs(stdout)),
            message: "[docker-vpc] ====== Scaffolding Dynamic Route Configurations ======"
        },
        {
            type: "fx",
            job: async (stdout) => (await crossCheckIntegrationTargets(stdout)),
            message: "[docker-vpc] ====== Cross Checking Integration Targets ======"
        },       
        {
            type: "shell",
            commands: {
                command: "docker",
                args: ["compose", "-f", `./gw_compose_files/${summary?.name}/docker-compose.yml`, "up", "-d", "--force-recreate"]
            },
            message: "[docker-vpc] ====== Taking API Gateway Online ======"
        },
        {
            type: "shell",
            commands : {
                command: "echo",
                args: ["[docker-vpc] ====== API Gateway Provisioned Successfully! ======"]
            },
            message: ""
        }
    ]

    const prepareComposeFile = async (stdout) => {

        try {
            // create empty file in gw_compose_file
            const dockerComposeFileLocation = `./gw_compose_files/${summary.name}/docker-compose.yml`
            
            const makeSubDir = await fx.base.exec(`mkdir ./gw_compose_files/${summary.name}`)            
            if (makeSubDir.exitStatus !== 0) throw makeSubDir.err

            const makeEmptyFile = await fx.base.exec(`touch ${dockerComposeFileLocation}`)
            if (makeEmptyFile.exitStatus !== 0) throw makeEmptyFile.err

            // define file contents
            const dockerComposeFile = 
`
services:
    traefik:
        image: traefik
        command:
            - --providers.docker
            - --providers.file.filename=/etc/traefik/traefik_dynamic.yml
            - --accesslog
        ports:
            - 80:80
        volumes:
            - /var/run/docker.sock:/var/run/docker.sock
            - ./traefik_dynamic.yml:/etc/traefik/traefik_dynamic.yml
        networks:
            - api-gw-network
${summary.integrations.map(target => `            - ${target}_tg-${target}-link`).join("\n")}
    
    static-index:
        image: ubuntu
        container_name: ${summary.name}-static-index
        ports: 
            - 9000
        volumes:
            - ./static.html:/usr/share/html/index.html:rw
        command: >
            bash -c "apt update && apt install -y python3 && cd /usr/share/html/ && python3 -m http.server 9000"
        networks:
            - api-gw-network
    
networks:
${summary.integrations.map(target => `    ${target}_tg-${target}-link:\n        external: true`).join("\n")}
    api-gw-network:
        driver: bridge
`            
            // echo file contents into file
        const echoToFile = await fx.base.exec(`echo '${dockerComposeFile}' > ${dockerComposeFileLocation}`)        
        if (echoToFile.exitStatus !== 0) throw echoToFile.err

        stdout("[docker-vpc] generated api-gw configuration file successfully!")
        return 0
        } 
        catch (err) {
            // stdout compose file cannot be created
            console.log('errr', err)            
            stdout(err)
        }       
    }

    const scaffoldTraefikConfigs = async(stdout) => {       

        try{
            const makeEmptyFile = await fx.base.exec(`touch ./gw_compose_files/${summary.name}/traefik_dynamic.yml`)
            if (makeEmptyFile.exitStatus !== 0 ) throw makeEmptyFile.err

            const traefik_file=
`
http:
    routers:
        index:
            rule: "Host(\`localhost\`) && Path(\`/\`)"
            service: static-index

${summary.serviced_routes.map(rt => 
    `        ${rt.integration_target}:
            rule: "Host(\`localhost\`) && PathPrefix(\`${rt.resource_path}\`)"
            service: ${rt.integration_target}
            middlewares:
                - strip-prefix`).join(("\n"))}
    


    middlewares:
        strip-prefix:
            stripPrefix:
                prefixes:
${summary.serviced_routes.map(rt => `                - "${rt.resource_path}"`).join("\n")}



    services:
        static-index:
            loadBalancer:
                servers:
                    - url: "http://${summary.name}-static-index:9000"
        
${summary.integrations.map(tg => 
    `        ${tg}:
             loadBalancer:
                 servers:
                    - url: "http://${tg}_traefik:80"`).join("\n")}  
        
`
            
            // fx echo file into file path
            const echoToFile = await fx.base.exec(`echo '${traefik_file}' > ./gw_compose_files/${summary.name}/traefik_dynamic.yml`)
            if (echoToFile.exitStatus !== 0) throw echoToFile.err
            // check exit status, stdout output/error
            stdout("[docker-vpc] generated api-gw route configuration file successfully!")
            // fx echo routes into routes.html
            const makeEmptyDiscFile = await fx.base.exec(`touch ./gw_compose_files/${summary.name}/static.html`)
            if (makeEmptyDiscFile.exitStatus !== 0) throw makeEmptyFile.err

            const routeDiscoveryFile = 
`
<html>
    <body>
        <h2>Routes Available:</h2>
        <ul>
            ${summary.serviced_routes.map(rt => `<li>${rt.resource_path}</li>`).join("")}
        </ul>
    </body>                    
</html>   
`
            const echoToDiscFile = await fx.base.exec(`echo '${routeDiscoveryFile}' > ./gw_compose_files/${summary.name}/static.html`)
            if (echoToDiscFile.exitStatus !== 0) throw echoToDiscFile.err

            // check exit status, stdout output, error
            stdout("[docker-vpc] Dynamic Route Configuration Scaffolding Successful!")
            setIsFileReady(true)
            return 0

        }
        catch (err) {        
            stdout(err)
        }        
    }

    const crossCheckIntegrationTargets = async(stdout) => {
        const integrationTargets = summary.integrations
       
        let isSuccessful = true
        for (const target of integrationTargets){
            const exitObj = await fx.base.exec("sh ./bin/cross_check_integrations.sh " + target)
            stdout(exitObj.out)
            isSuccessful = exitObj.exitStatus == 0
        }

        return isSuccessful ? 0 : 1                    
    }

    const getConfigFiles = async() => {
        setComposeFile(await fx.base.cat_file(`./gw_compose_files/${summary.name}/docker-compose.yml`))
        setTraefikConfigFile(await fx.base.cat_file(`./gw_compose_files/${summary.name}/traefik_dynamic.yml`))        
    }
    

    return {
        jobs,
        checkpoint,
        setCheckpoint,
        isFileReady,
        composeFile,
        traefikConfigFile,
        getConfigFiles,
        location, 
        summary,
        setSummary
    }
}

export default useProvisionHTTP_hooks