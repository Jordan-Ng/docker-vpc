import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom'
import fx from '../../fx'

const useProvisionLB_hooks = () => {
    const [checkpoint, setCheckpoint] = useState(0)
    const [composeFile, setComposeFile] = useState(undefined)
    const location = useLocation()

    const jobs = [
        {
            commands : {
                command: "echo",
                args: ["[docker-vpc] ====== Preparing Configuration File ======"]
            },
            message: ""
        },
        {
            commands : {
                command: "echo",
                args: ["[docker-vpc] ====== Creating Load Balancer Service ======"]
            },
            message: ""
        },
        {
            commands : {
                command: "docker",
                args: ["compose", "-f", location.state.filePath, "up", "-d", "--no-recreate"]
            },
            message: "[docker-vpc] ====== Starting Load Balancer Service ======"
        },
        {
            commands : {
                command: "echo",
                args: ["[docker-vpc] ====== Load Balancer Provisioned Successfully! ======"]
            },
            message: ""
        }        
    ]
    

    const getComposeFile = async () => {
        const data = await fx.base.cat_file(location.state.filePath)
        if (data) {
            setComposeFile(data)
            return
        }
        setComposeFile("Unable to retrieve compose file")
    }    

    return {checkpoint, setCheckpoint, getComposeFile, composeFile, jobs}
}

export default useProvisionLB_hooks