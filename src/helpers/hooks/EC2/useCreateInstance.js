import React, {useState, useEffect} from 'react'
import {useNavigate} from "react-router-dom"
import fx from "../../fx"
import INSTANCE_TYPES from "../../../constants/INSTANCE_TYPES.json"


const useEC2Creation_hooks = () => {
    // ------ States ------
    const navigate = useNavigate()
    // const [portMappings, setPortMappings] = useState([])
    const [portMappings, setPortMappings] = useState([{from:"8080", to:"8000"},{from:"8081", to:"8082"}])
    const [isValidName, setIsValidName]= useState(undefined)
    const [timer, setTimer] = useState(null)
    const [instanceTypes, setInstanceTypes] = useState({})
    const [inUsePorts, setInUsePorts] = useState(undefined)
    const [addPortError, setAddPortError] = useState({
        error: false,
        message: ""
    })

    const [summary, setSummary] = useState({
        instanceName : "express-app",
        image: "ubuntu",
        instanceType: {"Instance Size": "t1.micro",
        "vCPU": 1,
        "Memory": 1,
        "EBS Only" : true,            
        "Instance Storage": "EBS-Only"},
        volume: "poc-test",
        allowHTTP: true,
        allowHTTPS: true,
        additionalPorts: ["8081"],        
        network: "shared-poc",
        // entrypoint: ["npm", "start", "--prefix", "/root/dummy-express"]        
        entrypoint: ["bash", "-c" , "NODE_APP_SERVICE=Registrar npm start --prefix /root/dummy-express"]        

        // instanceName : undefined,
        // image: undefined,
        // instanceType: undefined,
        // volume: undefined,
        // allowHTTP: false,
        // allowHTTPS: false,
        // additionalPorts: [],        
        // networks: undefined,
        // entrypoint: []
    })

    const [options, setOptions] = useState({
        name: undefined,
        images: undefined,
        ami: undefined,
        instance_types : INSTANCE_TYPES,
        volume: undefined,
        networks: undefined
    })
    
    //  ------- useEffect handlers -------
    

    // ------ handlers -------
    const handleTextChange = (e) => {
        setIsValidName(undefined)

        setSummary({
            ...summary,
            instanceName: e.target.value.replace(/\s+/g, '-')
        })

        clearTimeout(timer)

        const newTimer = setTimeout(async () => {
            if (e.target.value.length >= 3)
            setIsValidName(await fx.ec2.is_valid_instance_name(e.target.value.replace(/\s+/g, '-')) && e.target.value.length >= 3)

        }, 1000)

        setTimer(newTimer)
    }
     
    const populateInputOptions = async () => {
        const catalog = {}

        // create object catalog for all instance types
        Object.keys(INSTANCE_TYPES).map(fam => {
            INSTANCE_TYPES[fam].forEach((instType, ind) => {
                catalog[instType["Instance Size"]] = {
                    ...INSTANCE_TYPES[fam][ind],
                    family : fam
                }
            })
        })

            
        const availableVolumes = JSON.parse( await fx.ec2.list_volumes()).map(vol => vol["name"])
        const availableNetworks = JSON.parse(await fx.ec2.list_networks()).map(obj => obj.name)

        const unavailablePorts = (await fx.ec2.list_ports_in_use()).split('\n').map(port => parseInt(port))
        unavailablePorts.pop()

        
        const ami = [];
        const images = ["ubuntu"];                    
        
        setInstanceTypes(catalog)              
        setInUsePorts(new Set(unavailablePorts))
        setOptions({
            ...options,
            ami,
            images,
            volume : availableVolumes, 
            networks: availableNetworks               
        })        
    }

    const handleSelect = (val, opt, field) => {
        const newState = {
            ...summary
        }

        newState[field] = val

        if (field === "instanceType") {            
            newState[field] = instanceTypes[val]

            if (!instanceTypes[val]["EBS Only"]){
                newState.volume = null
            }
        }

        
        setSummary(newState)  
    }

    const handleAdditionalPortSelection = (val) => {
        
        const isValidPorts = val.filter(port => Number.isNaN(Number(port))).length == 0
        
        if (isValidPorts){
            setSummary({
                ...summary,
                additionalPorts: val
            })
            setAddPortError({
                error: false,
                message: ""
            })
        }
        else {
            
            setSummary({
                ...summary,
                additionalPorts: val.filter(port => Number.isInteger(Number(port)))
            })
            setAddPortError({
                error: true,
                message: "Please enter a valid port number"
            })
        }
    }

    const handleRemoveAdditionalPort = (port) => {
        setSummary({
            ...summary,
            additionalPorts: summary.additionalPorts.filter(p => p != port)
        })
    }

    const handleChangePortMapping = (e, id, field, action) => {
        
        switch(action) {
            case "update":                              
                let update = portMappings.map((pm, ind) => ind == id ? {...pm, [field]: e} : pm)

                setPortMappings(update)
                return            
            
            case "new":                                
                setPortMappings([...portMappings, {from:undefined, to:undefined}])
                return

            case "remove":                
                
                setPortMappings(portMappings.filter((item, ind) => ind != id))
                return
                        
        }
    }

    const handleAddEntryPointCommand = (e) => {
        setSummary({
            ...summary,
            entrypoint: e.target.value.split(" ")
        })

    }

    const handleNetworkChange = (inputState) => {
        setSummary({
            ...summary,
            network: inputState
        })
    }

    const handleFormSubmit = async (userScriptRef) => {        
        
        const emptyFields= Object.keys(summary)
        .filter(field => summary[field] == undefined)
    
        if (emptyFields.length > 0){
            const invalidFormObject = {}
            for (let field of emptyFields) {
                invalidFormObject[field] = null            
            }
            const inValidFields ={
                ...summary,                                
                ...invalidFormObject
            } 
            setSummary(inValidFields)
            return
        }

        navigate(`/instance/create/new`, {state: {
            data: await prepareDockerfile({
                ...summary,
                isValidName,
                portMappings,
                userScripts: userScriptRef?.current.getUserScripts()
            })
        }})
        
    }

    const prepareDockerfile = async(data) => {
        try {
            const dockerfileLocation = `./machine_images/${data.instanceName}/Dockerfile`
            await fx.base.exec(`mkdir ./machine_images/${data.instanceName}`)
            await fx.base.exec(`touch ${dockerfileLocation}`)
            
            const dockerfile = 
`FROM ${data.image}:latest 
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
            return data         
        }
        catch {            
            console.log("prepare dockerfile error")
        }
    }

    
    return {
        isValidName, 
        summary, 
        portMappings,
        options, 
        addPortError,
        handleTextChange, 
        populateInputOptions, 
        handleSelect,
        handleAdditionalPortSelection,
        handleRemoveAdditionalPort,
        handleAddEntryPointCommand,
        handleChangePortMapping,
        handleNetworkChange,
        handleFormSubmit,
        inUsePorts
    }
}

export default useEC2Creation_hooks
