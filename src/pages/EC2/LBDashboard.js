import React, {useState, useEffect} from 'react'

import {Alert, Kbd, Space, Loader, Button, Badge, Box, LoadingOverlay, Modal as ModalMan, Text, Container, Flex, Table, Checkbox} from "@mantine/core"
import { useDisclosure } from '@mantine/hooks'
import {ActionIcon, Modal, DeleteConfirmationModal, Term} from "../../components"
import {IconInfoCircle, IconRefresh, IconTrash, IconAlertTriangle, IconFileText} from "@tabler/icons-react"
import useEC2LBDashboard_hooks from '../../helpers/hooks/EC2/useLBDashboard'


const LBDashboard = () => {
    const {lbData, get_lb_cluster_information, stop_cluster, start_cluster, delete_clusters, ssh_instance, isVisible, message} = useEC2LBDashboard_hooks()
    const [selectedRows, setSelectedRows] = useState([])
    const [active, setActive] = useState(undefined)
    const [isOpen, {open, close}] = useDisclosure(false)

    useEffect(() => {
        get_lb_cluster_information()
    }, [])        


    const handleRowClick = (ind) => {
        setActive(lbData[ind])
        open()
    }

    return(
    <Box>
        <LoadingOverlay visible={!isVisible} overlayProps={{blur: 2, backgroundOpacity: 0.9}} loaderProps={{children: 
                    <div>
                        <Text fw={500}><Loader size="xs" mr="sm"/> 
                        Temporarily blocked. Please interact with spawned terminal
                        </Text>
                        <Text size="sm">When you are ready to end the shell session, hit &nbsp; <Kbd>⌘</Kbd> + <Kbd>Q</Kbd> &nbsp; on the terminal to resume on the main window</Text>
                        
                        <Text size="xs" mt="xs" c="teal">* Please allow up to 5 seconds for cleanup process to trigger (due to polling)</Text>

                        <Space h="xl"/>
                        <Text size="sm" fw={500} c="blue" ta="center">Status: {message}</Text>
                        <Space h="xl"/>

                        <Alert variant="light" color="yellow" title="Trying To Be Smart?" icon={<IconInfoCircle />} style={{width: "500px"}}>
                            The spawned terminal is a new process instance of the Terminal application,
                            with an automated connection to the container instance of your choice.
                            As a fully operational shell, one may be tempted to <Kbd>exit</Kbd> the connection,
                            and run something destructive like <Kbd>rm -rf /</Kbd>. Try it, it's your funeral. 
                        </Alert>
                    </div>
                    }}/>

        <Container>
            <div style={{marginBottom: "20px", display: "flex", justifyContent: "end"}}>
                    <ActionIcon 
                        props = {{
                            color: "cyan",
                            callback : get_lb_cluster_information,                        
                            icon: IconRefresh ,
                            iconStyle: {
                                width: '60%',
                                height: '60%'
                            },
                            onClick: get_lb_cluster_information
                        }}
                    />
                    <Modal 
                        props = {{                        
                            child: DeleteConfirmationModal,
                            childState: {                  
                                
                                state: selectedRows.map(item => item.name)
                                          
                            },
                            onClickHandler : () => {delete_clusters(selectedRows); setSelectedRows([])},
                            color: "red",
                            rightIcon : <IconTrash />,
                            buttonText : "Delete Load Balancer(s)",
                            buttonDisabled : selectedRows.length  === 0
                        }}
                    />
            </div>
            
            <ModalMan opened={isOpen} onClose={close} title="Target Group Information" size='xxl' yOffset={100}>
                
                <Flex>
                <Badge>{active?.name}</Badge>
                <Space w="sm"/>
                <Text size="xs" c="gray">{active?.configFile}</Text>
                </Flex>

                <Space h="lg"/>

                <Table>
                    <Table.Thead>
                        <Table.Tr>                                            
                            <Table.Th>Instance Name</Table.Th>
                            <Table.Th>Machine Image</Table.Th>
                            <Table.Th>Type</Table.Th>
                            <Table.Th>Network</Table.Th>
                            <Table.Th>Port</Table.Th>                                    
                            <Table.Th>State</Table.Th>                                    
                            <Table.Th>Actions</Table.Th>                                    
                            <Table.Th>Logs</Table.Th>                                    
                        </Table.Tr>
                    </Table.Thead>
                                    
                    <Table.Tbody>
                        {active?.components.map((comp, ind) => (
                            <Table.Tr key={ind}>
                                <Table.Td>{comp.name}</Table.Td>
                                <Table.Td>{comp.machine_image}</Table.Td>
                                <Table.Td>{comp.type}</Table.Td>
                                <Table.Td>{comp.network}</Table.Td>
                                <Table.Td>{comp.application_port}</Table.Td>
                                <Table.Td><Badge color={comp.state == "running" ? "blue" : "yellow"}>{comp.state}</Badge></Table.Td>
                                {/* <Table.Td>{comp.state == "running" ? <Flex><Button size="xs">Connect</Button><Space w="xs"/><Button size="xs" color="red">Stop</Button></Flex> : ""}</Table.Td> */}
                                <Table.Td>{comp.state == "running" ? <Button size="xs" onClick={() => ssh_instance(comp.name)}>Connect</Button> : ""}</Table.Td>
                                <Table.Td>
                                    <Modal 
                                        props={{
                                            child: Term,
                                            childState: {
                                                commands : {
                                                    command: "docker",
                                                    args : ["logs", comp.name],
                                                },
                                            },
                                            color: "gray",
                                            variant: "transparent",
                                            rightIcon: <IconFileText stroke={.5} />                                        
                                        }}
                                    />

                                </Table.Td>
                            </Table.Tr>

                        ))}
                    </Table.Tbody>
                </Table>
            </ModalMan>

            <Table>
                <Table.Thead>
                    <Table.Tr>                    
                        <Table.Th></Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th># of Services</Table.Th>
                        <Table.Th>Network</Table.Th>
                        <Table.Th>State</Table.Th>
                        <Table.Th>Action</Table.Th>                                    
                        <Table.Th>Logs</Table.Th>                                    
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                    {lbData ? lbData.map((lb,ind) => (
                        <Table.Tr key={ind} style={{cursor: "pointer"}}>
                            <Table.Td>
                                <Checkbox 
                                    checked={selectedRows.filter(obj => obj.name === lb.name).length == 1}
                                    onChange={e => setSelectedRows(
                                        e.currentTarget.checked ? [...selectedRows, {name: lb.name ,file: lb.configFile}] : selectedRows.filter(obj => obj.file != lb.configFile)
                                    )}
                                />
                            </Table.Td>
                            <Table.Td onClick={() => handleRowClick(ind)}>{lb.name}</Table.Td>
                            <Table.Td onClick={() => handleRowClick(ind)}>{lb.components.length}</Table.Td>
                            <Table.Td onClick={() => handleRowClick(ind)}>{lb.network}</Table.Td>
                            <Table.Td onClick={() => handleRowClick(ind)}><Badge color={lb.status == "running" ? "blue": "yellow"}>{lb.status}</Badge></Table.Td>
                            <Table.Td>
                                {lb.status == "running" ? 
                                <Button size="xs" color="red" onClick={() => stop_cluster(lb.configFile, lb.name)}>Stop</Button> 
                                :<Button size="xs" onClick={() => start_cluster(lb.configFile, lb.name)}>Start</Button> }
                            </Table.Td>
                            <Table.Td>
                                
                                 <Modal 
                                    props={{
                                        child: Term,
                                        childState: {
                                            commands : {
                                                command: "docker",
                                                args : ["compose", "-f", lb.configFile, "logs"],
                                            },
                                        },
                                        color: "gray",
                                        variant: "transparent",
                                        rightIcon: <IconFileText stroke={.5} />                                        
                                    }}
                                 />
                                
                            </Table.Td>
                        </Table.Tr>
                    )) : <Table.Tr><Table.Td><Loader /></Table.Td></Table.Tr>}
                </Table.Tbody>
            </Table>
        </Container>
    </Box>
    )
}

export default LBDashboard