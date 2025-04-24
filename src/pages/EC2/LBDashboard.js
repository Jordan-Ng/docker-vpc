import React, {useState, useEffect, useRef} from 'react'
import useLBDashboard from '../../helpers/hooks/EC2/useLBDashboard'
import { Badge, Box, Flex, Space, Text } from '@mantine/core'
import { Button, Table, DeleteConfirmationModal, SSHOverlay, Terminal } from '../../components'
import { IconFileText, IconRefresh, IconTrash } from '@tabler/icons-react'
import fx from '../../helpers/fx'


const TGModal = ({data, addHandlers}) => {          
    
    return(
        <>            
            <Flex>
            <Badge>{data?.name}</Badge>
            <Space w="sm"/>
            <Text size="xs" c="gray">{data?.configFile}</Text>

            <Space h="lg"/>
            </Flex>

            <Table 
                props={{
                    columns: ["Instance Name", "Machine Image", "Type", "Network", "Port", "State", "Actions", "Logs"],
                    data: data?.components.map((comp, ind) => ({
                        name: comp.name,
                        machine_image: comp.machine_image,
                        type: comp.type,
                        network: comp.network,
                        port: comp.application_port,
                        state: <Badge color={comp.state == "running" ? "blue" : "yellow"}>{comp.state}</Badge>,
                        action: comp.state == "running" && comp.machine_image != "traefik" ? <Button 
                            variant="default"
                            props={{
                                onClick:  () => addHandlers.ssh_instance(comp.name),
                                button: {
                                    text: "Connect",
                                    size: "xs"
                                }
                            }}
                        /> : <Text ta="center">-</Text>,
                        logs: <Button 
                            variant="modal"
                            props={{
                                type: "icon-only",
                                modal: {
                                    size: "90vw"
                                },           
                                onClose: comp.state == "running" ? () => fx.base.kill(addHandlers.terminal_ref.current.getPid()): () => {},                         
                                child: () => <Terminal
                                    ref={addHandlers.terminal_ref}                                                                         
                                    props={{
                                        variant: "single",
                                        job: fx.ec2.show_vi_logs,
                                        args: comp.name
                                    }}
                                />,
                                button: {
                                    icon: <IconFileText stroke={1.5}/>,
                                    variant: "transparent",
                                    color: "grey"                                   
                                }
                            }}
                        />
                    }))
                }}
            />
        </>
    )
}


const LBDashboard = () => {
    const {lbData, message, isVisible, get_lb_cluster_information, start_lb_cluster, stop_lb_cluster, ssh_instance, delete_lb_clusters} = useLBDashboard()
    const terminalRef = useRef()
    useEffect(() => {get_lb_cluster_information()}, [])

    return(
        <Box>            
            <SSHOverlay 
                message={message}
                isVisible={isVisible}
            />

            {<Table 
                props={{
                    rowSelectable: true,                    
                    rowAttributeSelect: "Name",

                    modal: {
                        title: "Target Group Information",
                        child: TGModal,
                        size: "xxl",
                        onOpen: (dt) => lbData.filter(tg => tg.name === dt["Name"])[0],
                        addHandlers : {
                            ssh_instance:  (cont_name) => ssh_instance(cont_name),
                            terminal_ref: terminalRef                           
                        }
                    },


                    taskbar:{
                        props: {
                            Right: ({selectedRows, setSelectedRows}) => (<Flex>
                                <Button 
                                    variant="default"
                                    props={{
                                            type:"icon-only",
                                            onClick: get_lb_cluster_information,
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
                                                onClickHandler: () => {delete_lb_clusters(selectedRows); setSelectedRows([])},
                                                state: selectedRows
                                            },                                                                                                                                                               
                                            button: {                                            
                                                text: "Delete Load Balancer(s)",
                                                color: "red",
                                                rightSection: <IconTrash stroke={1.5}/>,
                                                disabled: selectedRows?.length == 0                                                                                                    
                                            }
                                        }}
                                />
                            </Flex>)
                        }
                    },


                    columns: ["Name", "# of Services", "Network", "State", "Action", "Logs"],
                    disableColumnSelectOn: ["Action", "Logs"],
                    data: lbData.map(tg => ({                        
                        "Name": tg.name,
                        "# of Services": tg.components.length,
                        "Network": tg.network,
                        "State": <Badge color={tg.status == "running" ? "blue" : "yellow"}>{tg.status}</Badge>,
                        "Action": tg.status == "running" ? 
                        <Button 
                            variant="default"
                            props={{
                                onClick: () => stop_lb_cluster(tg.name, tg.configFile),
                                button: {
                                    text: "Stop",
                                    color: "red",
                                    size: "xs"
                                }
                            }}
                            /> 
                        : 
                        <Button 
                            variant="default"
                            props={{
                                onClick: () => start_lb_cluster(tg.name, tg.configFile),
                                button: {
                                    text: "Start",
                                    size: "xs"
                                }
                            }}
                        />,
                        "Logs": <Button 
                            variant="modal"
                            props={{
                                type: "icon-only",
                                
                                onClose: tg.status == "running" ? () => fx.base.kill(terminalRef.current.getPid()) : () => {},
                                modal: {                                    
                                    size: "90vw"
                                },                                
                                child: () => (<>
                                <Terminal 
                                    ref={terminalRef}
                                    props={{
                                        variant: "single",
                                        job: fx.ec2.show_lb_logs,
                                        args: tg.configFile
                                    }}
                                /></>),
                                button: {
                                    icon: <IconFileText stroke={1.5}/>,
                                    variant: "transparent",
                                    color: "grey"
                                }
                            }}
                        />
                    }))
                }}
            />  }           
        </Box>
    )
}

export default LBDashboard 