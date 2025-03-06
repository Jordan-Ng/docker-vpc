import React from 'react'
import {Text, Button, Space, TextInput, Group, Flex, Select, NumberInput, Tooltip, ActionIcon} from '@mantine/core'
import { IconInfoCircle, IconX } from '@tabler/icons-react'

const ServiceRow = ({id, removeHandler}) => {    

    return(
        <Flex justify="space-between">
            <Select 
                placeholder="Machine Image"
                style={{width: "45%"}}
            />            

            <NumberInput 
                placeholder="Port"                
                hideControls
                style={({width: "45%"})}
                rightSection={
                    <Tooltip position="right-end" color="blue" label="Port where this application will be running from">
                        <IconInfoCircle size={20} color="lightGray"/>
                    </Tooltip>

                }
            />

            
            <ActionIcon variant='transparent' color="red" style={{alignSelf: "center"}} onClick={() => removeHandler(id)}> 
                <IconX size={20} stroke={.5}/>
            </ActionIcon>            
        </Flex>
    )
}


const AddServices = ({state, setState, imageOptions}) => {

    const onAdd = () => {
        setState({
            ...state,
            services: [...state.services, {image: undefined, port: undefined}]
        })
    }

    const onRemove = (id) => {
        setState({
            ...state,
            services: state.services.filter((svc, ind) => ind != id)
        })
    }

    const onChange = (field, value) => {

    }

    return(
        <>
        <div>
            <Text size="md">Services</Text>
            {/* <Space h="sm"/> */}
            <Text size="xs" c="gray">Define services to place behind this load balancer</Text>
        </div>
        
        <Space h="md"/>
        {state.services.map((service, ind) => <div key={ind}><ServiceRow id={ind} removeHandler={onRemove}/><Space h="xs"/></div>)}
        <Button fullWidth variant="transparent" onClick={onAdd}>Add New Service</Button>
        </>
    )
}

export default AddServices