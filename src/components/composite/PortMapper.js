import React, {useState, forwardRef, useImperativeHandle} from "react"
import {NumberInput, Group, Button, Flex, ActionIcon, TextInput} from '@mantine/core'
import {IconArrowsExchange, IconX} from "@tabler/icons-react"

const MapperRow = ({id, handleChange, handleRemove, valObj, inUse}) => {    
    return(
    <Flex justify="space-between" align="center">                
        <NumberInput 
        placeholder="Host port (3000 ~ 8999)" 
        hideControls                  
        error={inUse?.has(valObj.from) ? "Host Port in Use" : false}        
        min={3000}
        max={8999}
        onChange = {e => handleChange(e, id, "from")}
        value={valObj.from}
        />
    

        <IconArrowsExchange size={20} stroke={.5} />

        <NumberInput 
        placeholder="Instance port (0 ~ 65535)" 
        hideControls
        min = {0}
        max = {65535}                
        onChange = {e => handleChange(e, id, "to")}
        value={valObj.to}
        />                

        <ActionIcon variant="transparent" color="red" onClick={() => handleRemove(id)}>
            <IconX size={20} stroke={.5}/>
        </ActionIcon>
    </Flex>)
}

const PortMapper = ({handleAdd, handleChange, handleRemove, store, inUse}) => {
    
    return(
        <Group>            
            {store.map((pm, ind) => 
            <MapperRow 
            key={ind} 
            id={ind} 
            handleChange={handleChange} 
            handleRemove={handleRemove}   
            inUse={inUse}          
            valObj={store[ind]}/>)}
            <Button 
                variant="transparent"                
                onClick = {handleAdd}
                fullWidth                
            >Add New Row</Button>            
        </Group>
    )
}

export default PortMapper