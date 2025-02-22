import React, {useState, useEffect} from "react"
import {Text, Space, Anchor, Timeline, Grid, Tabs, Flex, Loader, Center, Button} from "@mantine/core"
import { IconTerminal, IconBrandDocker, IconCheck } from "@tabler/icons-react"
import {Terminal, CodeViewer} from "../../components"

import useEC2NewInstanceProvision_hooks from "../../helpers/hooks/EC2/newInstanceProvision"


const NewInstanceProvision = () => {
    
    const {location, checkpoint, instructions, fileReady, userTampered, setCheckpoint, prepareDockerfile} = useEC2NewInstanceProvision_hooks()
    
    // const instructions ={
    //     "1":{
    //         commands: {
    //           command: "docker",
    //           args: ["buildx", "build", "-t", location.state.data.instanceName, `./machine_images/${location.state.data.instanceName}`]
    //         },
    //         message: "[docker-vpc] ====== Building image from dockerfile.. ======"
    //         },
    //     "2":{
    //         commands : {
    //           command: "docker",
    //           args: ["container", "create", "-it", 
    //           ...location.state.data.network ? ["--network", location.state.data.network] : "" ,
    //           ...location.state.data.volume ? ["-v", `${location.state.data.volume}:/home`] : "",
    //           ...location.state.data.portMappings.flatMap(mapObj => ['-p', `${mapObj.from}:${mapObj.to}`]),
    //           "--name", location.state.data.instanceName, 
    //           "--label", "type=virtual_instance" , location.state.data.image]
    //         },
    //         message: "[docker-vpc] ====== Creating Container Instance.. ======"
    //         },
    //     "3" : {
    //         commands : {
    //             command: "",
    //             args : []
    //         },
    //         message: "[docker-vpc] Container provisioned succesfully!"
    //     }
    // }    

    useEffect(() => {                     
        prepareDockerfile(location.state.data)
    },[])


    return(
        <>        
            <Space h="xl"/>
            {userTampered ? <Center>
                <Text>Told you not to refresh dumbass</Text>
                <Space w="sm"/>
                <Anchor href="/" underline="hover">Return to Dashboard</Anchor>
                </Center> : <Grid>

                <Grid.Col span={12} style={{display: "flex" , justifyContent:"center"}}>
                    {checkpoint == Object.keys(instructions).length ? 
                    <Flex><IconCheck style={{width: "15px", height: "15px"}} color="green"/><Space w="sm"/><Text size="sm">Provisioning Complete! <Anchor href="/" underline="hover">View Dashboard</Anchor></Text></Flex> :
                    <Flex><Loader size="sm" /><Space w="sm"/><Text size="sm">Provisioning in Progress. Please do not refresh this page!</Text></Flex>
                    }
                </Grid.Col>
                
                <Grid.Col span={3} style={{display: "flex", alignItems:"center"}}>
                    <Timeline active={checkpoint}>
                        <Timeline.Item title="Preparing Dockerfile" lineVariant="dashed">
                            <Text c="dimmed" size="sm">Generating Dockerfile</Text>
                        </Timeline.Item>

                        <Timeline.Item title="Building AMI" lineVariant="dashed" >
                            <Text c="dimmed" size="sm">Building new AMI with user configurations..</Text>
                        </Timeline.Item>

                        <Timeline.Item title="Provisioning Instance" lineVariant="dashed">
                            <Text c="dimmed" size="sm">Creating Container from AMI</Text>
                        </Timeline.Item>

                        <Timeline.Item title="Starting Instance" lineVariant="dashed">
                            <Text c="dimmed" size="sm">Starting Created Container</Text>
                        </Timeline.Item>

                        <Timeline.Item title="Done!" lineVariant="dashed">                            
                            <Text c="dimmed" size="sm">Container provisioned. <Anchor href="/" underline="hover">View Dashboard</Anchor></Text>
                        </Timeline.Item>
                    </Timeline>
                </Grid.Col>  
                
                <Grid.Col span={9}>
                    <Tabs variant="outline" defaultValue="Terminal">
                        <Tabs.List>
                            <Tabs.Tab value="Terminal" leftSection={<IconTerminal style={{width: "15px", height: "15px"}}/>}>
                                <Text size="xs">Terminal</Text>
                            </Tabs.Tab>
                            <Tabs.Tab value="dockerfile" leftSection={<IconBrandDocker stroke={1} style={{width: "20px", height: "20px"}}/>}>
                                <Text size="xs">dockerfile</Text>
                            </Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="Terminal">
                            <Terminal 
                                instructions={instructions}
                                state={checkpoint}
                                setState={setCheckpoint}
                                />
                        </Tabs.Panel>

                        <Tabs.Panel value="dockerfile">
                            
                            {fileReady && <CodeViewer 
                                instanceName={location.state.data.instanceName}
                            />}
                        </Tabs.Panel>
                    </Tabs>
                </Grid.Col>
                
            </Grid>    }     
        </>
    )
}

export default NewInstanceProvision