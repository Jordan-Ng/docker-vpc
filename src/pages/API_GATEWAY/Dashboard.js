import React, {useState, useEffect, useRef} from 'react'
import { Box, Space, Container, Loader, Flex, Tooltip, Group, Badge, toRgba } from '@mantine/core'
import { IconInfoCircle, IconTrash, IconRefresh, IconFileText } from '@tabler/icons-react'
import {Table, DeleteConfirmationModal, Terminal, Button} from '../../components'
import useAPIGWDashboard_hooks from '../../helpers/hooks/API_GATEWAY/useAPIGWDashboard'
import fx from '../../helpers/fx'


const Dashboard =() => {
    const terminalRef = useRef()
    const {getGateways, gateways, startGateway, stopGateway, deleteGateways} = useAPIGWDashboard_hooks()    

    useEffect(() => {        
        getGateways()
    }, [])    

    return(
        <Box>            
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
                                                        onClick: () => getGateways(),
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
                                                            onClickHandler: () => {deleteGateways(selectedRows); setSelectedRows([])},
                                                            state: selectedRows
                                                        },                                                                                                                                                               
                                                        button: {                                            
                                                            text: "Delete API Gateway(s)",
                                                            color: "red",
                                                            rightSection: <IconTrash stroke={1.5}/>,
                                                            disabled: selectedRows?.length == 0                                                                                                    
                                                        }
                                                    }}
                                            />
                                        </Flex>)                                  
                                }
                            },                                 
                            rowAttributeSelect: "Name",                            
                            columns:  ["Name", "Status", "Configuration File", "Action", "Logs"],
                            data: gateways?.map(gw => ({
                                "Name" : gw.name,
                                "Status": <Badge color={gw.status.startsWith("running") ? "blue": "yellow"}>{gw.status}</Badge>,
                                "Configuration File": gw.configFile,
                                "Action": <Button 
                                    variant = "default"
                                    props={{
                                        onClick: gw.status.startsWith("running") ? () => stopGateway(gw.name) : () => startGateway(gw.name),
                                        button: {
                                            color: gw.status.startsWith("running") ? "red" : "blue",
                                            text: gw.status.startsWith("running") ? "Stop" : "Start",
                                            size: "xs"
                                        }
                                    }}
                                />,
                                "Logs": <Button 
                                    variant = "modal"
                                    props={{
                                        type: "icon-only",
                                        onClose: gw.status.startsWith("running") ? () => fx.base.kill(terminalRef.current.getPid()) : () => {},
                                        modal: {
                                            size: "90vw"
                                        },
                                        child: () => <Terminal 
                                            ref={terminalRef}
                                            props={{
                                                variant: "single",
                                                job: fx.api.show_gw_logs,
                                                args: gw.configFile
                                            }}
                                        />,
                                        button: {
                                            icon: <IconFileText stroke={1.5}/>,
                                            variant: "transparent",
                                            color: "grey"
                                        }
                                    }}
                                />
                            })),                                        
                        }}
                    />

                </Container> 
                

        </Box>
    )
}

export default Dashboard