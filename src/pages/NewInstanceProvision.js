import React, {useState, useEffect} from "react"
import {Container, Text, Space, SimpleGrid, Timeline, Grid, Tabs} from "@mantine/core"
import { IconTerminal, IconBrandDocker } from "@tabler/icons-react"
import {Terminal, CodeViewer} from "../components"


const NewInstanceProvision = () => {
    const [checkpoint, setCheckpoint] = useState(1)
    const instructions ={
        "1":{
            commands: {
              command: "docker",
              args: ["build", "-t", "test_cont", "./poc"]
            },
            message: "[docker-vpc] ====== Building image from dockerfile.. ======"
            },
        "2":{
            commands : {
              command: "docker",
              args: ["container", "create", "--name", "my_cont", "test_cont"]
            },
            message: "[docker-vpc] ====== Creating Container Instance.. ======"
            },
        "3" : {
            commands : {
                command: "",
                args : []
            },
            message: "[docker-vpc] Container provisioned succesfully!"
        }
    }    

    return(
        <>        
            <Space h="xl"/>
            <Grid>
                
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

                        <Timeline.Item title="Done!" lineVariant="dashed">
                            <Text c="dimmed" size="sm">Container provisioned. view dashboard</Text>
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
                            
                            <CodeViewer />
                        </Tabs.Panel>
                    </Tabs>
                </Grid.Col>
                
            </Grid>         
        </>
    )
}

export default NewInstanceProvision