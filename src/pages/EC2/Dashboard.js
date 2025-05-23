import React, {useState, useEffect, useRef} from 'react'
import { Box, Space, Container, Loader, Flex, Tooltip, Group } from '@mantine/core'
import { IconInfoCircle, IconTrash, IconRefresh } from '@tabler/icons-react'
import {Table, DeleteConfirmationModal, SSHOverlay, Button} from '../../components'
import useEC2Dashboard_hooks from "../../helpers/hooks/EC2/useEC2Dashboard"


const Dashboard =() => {
    const {getInstances, instances, isVisible, childMessage, deleteInstances} = useEC2Dashboard_hooks()    

    useEffect(() => {        
        getInstances()
    }, [])    

    return(
        <Box>
            <SSHOverlay 
                message={childMessage}
                isVisible={isVisible}
            />

            
            {instances ? 
                <Container>
                    <Space h="md"/>

                    <Table                         
                        props={{               
                            rowSelectable: true,
                            taskbar: {                                
                                props: {
                                    Left: () => (<Tooltip multiline w={500} position="right-end" color="blue" label="Clicked start but instance not running? You might have an ephemeral instance. Please review the generated dockerfile document">
                                            <IconInfoCircle size={20} color="gray"/>
                                        </Tooltip>),
                                    Right: ({selectedRows, setSelectedRows}) => (<Flex>
                                            <Button 
                                                variant="default"
                                                props={{
                                                        type:"icon-only",
                                                        onClick: getInstances,
                                                        button: {
                                                            icon : <IconRefresh stroke={1.5}/>,
                                                            color: "cyan",                                            
                                                        }
                                                    }}
                                            />
                                
                                            <Space w="xs"/>
                                
                                            <Button 
                                                variant="modal"                                
                                                props={{                                                                                                                                                                                                                    
                                                        child: DeleteConfirmationModal,
                                                        childState: {                                                            
                                                            onClickHandler: () => {deleteInstances(selectedRows); setSelectedRows([])},
                                                            state: selectedRows
                                                        },                                                                                                                                                               
                                                        button: {                                            
                                                            text: "Delete Instance(s)",
                                                            color: "red",
                                                            rightSection: <IconTrash stroke={1.5}/>,
                                                            disabled: selectedRows?.length == 0                                                                                                    
                                                        }
                                                    }}
                                            />
                                        </Flex>)                                  
                                }
                            },                                 
                            rowAttributeSelect: "name",                            
                            columns: instances.length > 0  ? Object.keys(instances[0]) : ["id", "image", "command", "mounts", "name", "state", "networks", "action"],
                            data: instances,                                        
                        }}
                    />

                </Container> 
                : <Loader />}

        </Box>
    )
}

export default Dashboard