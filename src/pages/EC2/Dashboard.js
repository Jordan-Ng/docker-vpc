import React, {useState, useEffect} from "react"

import {Alert, Kbd, Space, Loader, Button, Badge, Box, LoadingOverlay, Text, Container, Flex } from "@mantine/core"
import {IconInfoCircle, IconRefresh, IconTrash, IconAlertTriangle} from "@tabler/icons-react"

import {Table, ActionIcon, Modal, DeleteConfirmationModal} from "../../components"
import fx from "../../helpers/fx"


const Dashboard = () => {
    const [instances, setInstances] = useState(null)
    const [isVisible, setIsVisible] = useState(true)    
    const [selectedRows, setSelectedRows] = useState([])
    const [message, setMessage] = useState("")

    const startInstance = async (data) => {
        fx.base.exec(`docker start ${data["Names"]}`)
        .then( exitObj => {if (exitObj.exitStatus == 0){
            fx.base.notify(true,{message: `${exitObj.out.trim()} started`})            
            getInstances()
        }})
    }

    const stopInstance = async(data) => {
        fx.base.exec(`docker stop ${data["Names"]}`)
        .then( exitObj  => {
            if (exitObj.exitStatus == 0){
                fx.base.notify(true, {message: `Stopped ${exitObj.out.trim()}`})
                getInstances()
            }
        })
    }

    const getInstances = async () => {        
        const data = await fx.ec2.list_instances()    
        const formatted = JSON.parse(data)

        if (formatted.length == 0){
            setInstances([])
            return
        }

        setInstances(formatted.map(dt => ({
            id: dt["ID"],
            image: dt["Image"],
            command: dt["Command"],
            mounts: dt["Mounts"],
            name: dt["Names"],
            state: <Badge color={dt["State"] == "exited" ? "yellow" : "blue"}>{dt["State"]}</Badge>,
            networks: dt["Networks"],
            action: dt["State"] == "running" ? <Flex><Button size="xs" onClick={async() => {
                 
                    setIsVisible(!isVisible)

                    fx.ec2.ssh_instance(
                        [dt["Names"]], 

                        data => setMessage(data),   // onStdout handler
                        
                        () => (setMessage("") , setIsVisible(true))) // onExit handler                
                }}>Connect</Button>
                <Space w="xs"/>
                <Button size="xs" color="red" onClick={() => stopInstance(dt)}>Stop</Button>
                </Flex>  : 
                
                <Button size="xs" onClick={() => startInstance(dt)}>Start</Button>                                
        })))        
    }

     useEffect(() => {
        if (isVisible)  getInstances()
    }, [isVisible])

    return(        
            <Box pos="relative" style={{height: "800px"}}>
                <LoadingOverlay visible={!isVisible} overlayProps={{blur: 2}} loaderProps={{children: 
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
            {instances ?  <Container>
            
            <div style={{marginBottom: "20px", display: "flex", justifyContent: "end"}}>
                <ActionIcon 
                    props={{
                        color: "cyan",
                        callback : getInstances,                        
                        icon: IconRefresh ,
                        iconStyle: {
                            width: '60%',
                            height: '60%'
                        },
                        onClick: getInstances
                    }}
                />
                <Modal 
                    props = {{                        
                        child: DeleteConfirmationModal,
                        childState: {
                            state : selectedRows,
                            setState : setSelectedRows
                        },
                        
                        onClickHandler: async () => {
                            fx.ec2.delete_instances(selectedRows)
                            .then(() => getInstances().then(() => {
                                fx.base.notify("success", {
                                title: "Great Success!",
                                message: "Instance(s) deleted successfully"})

                                setSelectedRows([])
                            })
                            )
                            .catch(
                                errMsg => fx.base.notify("error", {
                                    title: "Sum Ting Wong",
                                    message: errMsg
                                })
                            )
                                                            
                        },
                        color: "red",
                        rightIcon : <IconTrash />,
                        buttonText : "Delete Instance(s)",
                        buttonDisabled : selectedRows.length == 0
                    }}
                />
            </div>

            <Table props={{
                showModal: false,
                columns:  instances.length > 0 ? Object.keys(instances[0]) : ["id", "image", "command", "mounts", "name", "state", "networks", "action"],
                rowSelectable: true,
                selectedRows : selectedRows,
                setSelectedRows : setSelectedRows,
                data: instances                
            }} /></Container> : <Loader />}
                        
            </Box>
    )
}

export default Dashboard