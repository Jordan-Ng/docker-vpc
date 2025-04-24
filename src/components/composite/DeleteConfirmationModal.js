import React from "react"
import {Space, Button, Badge, Text} from "@mantine/core"
import {IconAlertTriangle} from "@tabler/icons-react"

const DeleteConfirmationModal = ({props : {close, onClickHandler, state}}) => {
    const handleClick = async () => {        
        if (typeof onClickHandler === "function")await onClickHandler()
        close()
    }    

    return(
        <>
            <Text>Are you sure you want to delete the following item(s) ?</Text>
            <Text size="sm" c="red" style={{ display: "flex", alignItems:"center"}}>
                <IconAlertTriangle style={{ width: "15px", height: "15px"}}/> 
                &nbsp; 
                This is a destructive operation*
            </Text>
            <Space h="md"/>                 
            {state.map((vol, ind) => <Badge key={ind} style={{marginRight: "5px"}}>{vol}</Badge>)}
            <Space h="md"/>
                
            
            <Button color="red" fullWidth onClick={handleClick}>Delete</Button>
        </>
    )
}

export default DeleteConfirmationModal