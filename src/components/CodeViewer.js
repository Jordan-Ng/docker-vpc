import React, {useState, useEffect} from "react"
import { Code } from "@mantine/core"
import fx from "../helpers/fx"

const CodeViewer = (path) => {
    const [dockerfile, setDockerfile] = useState("")

    useEffect(() => {
        fx.ec2.cat_dockerfile(["poc","dockerfile"])
        .then(data => setDockerfile(data))
        .catch(() => setDockerfile("Error: Failed to retrieve dockerfile!"))
    }, [])

    return(<Code block style={{minHeight:"485.5px"}}>{dockerfile}</Code>)
}

export default CodeViewer