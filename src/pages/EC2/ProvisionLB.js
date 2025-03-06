import React, {useState, useEffect} from "react"
import {Text, Space, Anchor, Timeline, Grid, Tabs, Flex, Loader, Center, Button, Code} from "@mantine/core"
import { IconTerminal, IconBrandDocker, IconCheck } from "@tabler/icons-react"
import useEC2ProvisionLB_hooks from "../../helpers/hooks/EC2/useProvisionLB"
import {Terminal, CodeViewer} from "../../components"

const ProvisionLB = () => {
    const {prepareDockerComposeFile, fileReady, cat_dockerComposeFile, dockerCompose, instructions, checkpoint, setCheckpoint, location} = useEC2ProvisionLB_hooks()

    useEffect(() => {        
        prepareDockerComposeFile(location.state.data)        
    },[])

    useEffect(() => {
        if (fileReady) cat_dockerComposeFile()

    }, [fileReady])

   return( <>        
        <Space h="xl"/> 
        <Grid h="800px">

            <Grid.Col span={12} style={{display: "flex" , justifyContent:"center"}}>
                {checkpoint == Object.keys(instructions).length ? 
                <Flex><IconCheck style={{width: "15px", height: "15px"}} color="green"/><Space w="sm"/><Text size="sm">Provisioning Complete! <Anchor href="/load-balancer/dashboard" underline="hover">View LB Dashboard</Anchor></Text></Flex> :
                <Flex><Loader size="sm" /><Space w="sm"/><Text size="sm">Provisioning in Progress. Please do not refresh this page!</Text></Flex>
                }
            </Grid.Col>
            
            <Grid.Col span={4}>
            <Space h="xl"/>
            <Space h="xl"/>
            <Space h="xl"/>
            <Timeline active={checkpoint}>
                        <Timeline.Item title="Preparing Configuration File" lineVariant="dashed">
                            <Text c="dimmed" size="sm">Generating docker-compose.yaml</Text>
                        </Timeline.Item>

                        <Timeline.Item title="Composing Load Balancer Service" lineVariant="dashed" >
                            <Text c="dimmed" size="sm">Building new Load Balancer Orchestration with user configurations</Text>
                        </Timeline.Item>

                        <Timeline.Item title="Starting LB Target Group Cluster" lineVariant="dashed">
                            <Text c="dimmed" size="sm">Starting Load Balancer Orchestration</Text>
                        </Timeline.Item>                        

                        <Timeline.Item title="Done!" lineVariant="dashed">                            
                            <Text c="dimmed" size="sm">Load Balancer provisioned. <Anchor href="/load-balancer/dashboard" underline="hover">View LB Dashboard</Anchor></Text>
                        </Timeline.Item>
                    </Timeline>

            </Grid.Col>
            <Grid.Col span={8}>
                <Tabs variant="outline" defaultValue="Terminal">
                        <Tabs.List>
                            <Tabs.Tab value="Terminal" leftSection={<IconTerminal style={{width: "15px", height: "15px"}}/>}>
                                <Text size="xs">Terminal</Text>
                            </Tabs.Tab>
                            <Tabs.Tab value="docker-compose" leftSection={<IconBrandDocker stroke={1} style={{width: "20px", height: "20px"}}/>}>
                                <Text size="xs">docker-compose.yml</Text>
                            </Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="Terminal">
                            <Terminal 
                                instructions={instructions}
                                state={checkpoint}
                                setState={setCheckpoint}
                                />                                 
                        </Tabs.Panel>

                        <Tabs.Panel value="docker-compose">                                                        
                            <Code color="var(--mantine-color-blue-light)" block>{fileReady && dockerCompose}</Code>
                        </Tabs.Panel>
                    </Tabs>

            </Grid.Col>
        </Grid>
    </>)
}

export default ProvisionLB