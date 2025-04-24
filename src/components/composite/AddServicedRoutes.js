import React, {useState, forwardRef, useImperativeHandle, useEffect} from 'react'
import { Box, Select, Space, SimpleGrid, Text, TextInput, Flex } from '@mantine/core'
import { Button } from '../primitive'
import { IconX } from '@tabler/icons-react'

const ServicedRouteRow = ({props}) => {
    return(
        <>
        <SimpleGrid cols={4}>
            <Select 
                // data={["GET"]}
                // onChange={(val) => props.handleFieldChange("method", props.ind, val)}
                // value={props.svc['method']}
                disabled
                placeholder='ANY'
                value="ANY"
            /> 
            <TextInput 
                onChange={(e) => props.handleFieldChange("resource_path", props.ind, e.target.value)}
                value={props.svc['resource_path']}
            />
            <Select 
                data={props.integrations}
                onChange={(val) => props.handleFieldChange("integration_target", props.ind, val)}
                value={props.svc['integration_target']}
            /> 
            <Flex align="center">
                <Button 
                    variant="default"
                    props={{
                        type: "icon-only",
                        onClick: props.remove,
                        button: {                            
                            icon: <IconX size={20} />,
                            variant: "transparent",
                            color: "red"
                        }
                    }}
                />
            </Flex>
        </SimpleGrid>
        <Space h="xs"/>
        </>
    )
}

const AddServicedRoutes = forwardRef(({serviced_routes, integrations}, ref) => {
    const [servicedRoutes, setServicedRoutes] = useState(serviced_routes?.length > 0 ? serviced_routes : [])

    useImperativeHandle(ref, () => ({
        getServicedRoutes: () => servicedRoutes
    }))    

    const addNewRow = () => {
        setServicedRoutes([...servicedRoutes, {
            method: "ANY",
            resource_path: "",
            integration_target: ""
        }])
    }

    const removeRow = (ind) => {
        setServicedRoutes(servicedRoutes.filter((rt, id) => id !== ind))
    }
    
    const handleFieldChange = (field, ind, value) => {
        const temp = [...servicedRoutes]
        temp[ind][field] = value
        setServicedRoutes(temp)
    }
        

    return(
        <Box>
            <SimpleGrid cols={4}>
                <Text size="sm">Method</Text>
                <Text size="sm">Resource Path</Text>
                <Text size="sm">Integration Target</Text>
            </SimpleGrid>

            <Space h="xs"/>

            {servicedRoutes.map((svc,ind) => (
            <ServicedRouteRow 
                key={ind} 
                props={{
                    ind,
                    integrations,
                    svc,
                    remove: () => removeRow(ind),
                    handleFieldChange
                }}
            />))}
            <Space h="sm"/>            

            <Button 
                variant= "default"
                props={{
                    onClick: addNewRow,
                    button: {
                        text: "Add Integration",
                        variant: "outline"                        
                    }
                }}
            />            
        </Box>
    )
})

export default AddServicedRoutes