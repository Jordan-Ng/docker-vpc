import React from "react"
import {Space, Button, Badge, Text} from "@mantine/core"
import {IconAlertTriangle} from "@tabler/icons-react"
import fx from "../../helpers/fx"

const DeleteConfirmationModal = ({close, onClickHandler, states}) => {
    const handleClick = async () => {
        // const deleted = await fx.ec2.delete_instances(states.state)
        // states.setState([])
        // close()
        // callback()
        await onClickHandler()
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
            {states.state.map((vol, ind) => <Badge key={ind} style={{marginRight: "5px"}}>{vol}</Badge>)}
            <Space h="md"/>
                
            
            <Button color="red" fullWidth onClick={handleClick}>Delete</Button>
        </>
    )
}

export default DeleteConfirmationModal