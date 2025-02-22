import React, {useState, useEffect} from "react"
import { Code } from "@mantine/core"
import fx from "../helpers/fx"

const CodeViewer = ({instanceName}) => {
    const [dockerfile, setDockerfile] = useState("")

    useEffect(() => {        
        fx.ec2.cat_dockerfile(["machine_images", instanceName ,"Dockerfile"])
        .then(data => {            
            setDockerfile(data.out)})
        .catch((err) => {
            console.log(err)
            setDockerfile("Error: Failed to retrieve dockerfile!")})
    }, [])

    return(<Code block style={{minHeight:"485.5px"}}>{dockerfile}</Code>)
}

export default CodeViewer