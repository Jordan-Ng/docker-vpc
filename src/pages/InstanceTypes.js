import React from "react"
import {Container, Badge, Space} from "@mantine/core"
import {Table} from "../components"
import INSTANCE_TYPES from "../constants/INSTANCE_TYPES.json"

const InstanceTypes = () => {
    const data = INSTANCE_TYPES
    
    Object.keys(data).forEach((fam) => {
        data[fam] = data[fam].map(inst => {return {
            "Instance Size" : inst["Instance Size"],
            "vCPU" : inst["vCPU"],
            "Memory" : inst["Memory"],
            "Instance Storage" : inst["Instance Storage"]
        }})
    })    

    return(
        <Container>
            {Object.keys(data).map((instanceType, ind) => (
                <div style={{marginTop: "30px"}} key={ind}>
                    <Badge>{instanceType}</Badge>
                    <Space h="xs"/>
                    <Table 
                        props = {{
                            showModal : false,
                            rowChecked : false,                            
                            columns : Object.keys(data[instanceType][0]),                                                     
                            data: data[instanceType]                            
                        }}                        
                    />
                </div>
            ))}
        </Container>        
    )
}

export default InstanceTypes