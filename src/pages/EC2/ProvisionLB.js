import React, {useState, useEffect} from "react"
import {Container, Grid, Timeline, Text, Flex, Loader, Space, Anchor, Center, Tabs, Code} from "@mantine/core"
import { Terminal } from "../../components"
import { IconTerminal, IconBrandDocker, IconCheck } from "@tabler/icons-react"
import useProvisionLB_hooks from "../../helpers/hooks/EC2/useProvisionLB"

const ProvisionLB = () => {
    const {checkpoint, setCheckpoint, getComposeFile, composeFile, jobs, location} = useProvisionLB_hooks()

    useEffect(() => {        
        getComposeFile()
    }, [])    

    return(
        <Container p={0}>

            <Space h="xl"/>
            <Grid>
                <Grid.Col span={12}>
                    <Center>

                    {checkpoint == jobs.length ? 
                    <Flex><IconCheck style={{width: "15px", height: "15px"}} color="green"/><Space w="sm"/><Text size="sm">Provisioning Complete! <Anchor href="/load-balancer/dashboard" underline="hover">View LB Dashboard</Anchor></Text></Flex>
                    :
                    <Flex><Loader size="sm" /><Space w="sm"/><Text size="sm">Provisioning in Progress. Please do not refresh this page!</Text></Flex>}
                    </Center>
                    <Space h="lg"/>
                </Grid.Col>

                <Grid.Col h={600} span={3} align='center' style={{display: "flex", alignItems: "center"}}>
                
                <Timeline active={checkpoint}>

                            <Timeline.Item title="Preparing Project Workspace">
                                <Text c="dimmed" size="sm">Generating docker-compose.yaml</Text>
                            </Timeline.Item>

                            <Timeline.Item title="Composing Load Balancer Service">
                                <Text c="dimmed" size="sm">Building new Load Balancer Orchestration with user configurations</Text>
                            </Timeline.Item>

                            <Timeline.Item title="Starting LB Target Group Cluster">
                                <Text c="dimmed" size="sm">Starting Load Balancer Orchestration</Text>
                            </Timeline.Item>                        

                            <Timeline.Item title="Done!">                            
                                <Text c="dimmed" size="sm">Load Balancer provisioned. {checkpoint == jobs.length && <Anchor href="/load-balancer/dashboard" underline="hover">View LB Dashboard</Anchor>}</Text>
                            </Timeline.Item>
                        </Timeline>

                </Grid.Col>

                <Grid.Col h={600} span={9} style={{display: "flex", alignItems: "center", padding: "0px"}}>
                <Tabs variant="outline" defaultValue="Terminal" style={{width: "100%"}}>
                        <Tabs.List w>
                            <Tabs.Tab value="Terminal" leftSection={<IconTerminal style={{width: "15px", height: "15px"}}/>}>
                                <Text size="xs">Terminal</Text>
                            </Tabs.Tab>
                            <Tabs.Tab value="docker-compose" leftSection={<IconBrandDocker stroke={1} style={{width: "20px", height: "20px"}}/>}>
                                <Text size="xs">docker-compose.yml</Text>
                            </Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="Terminal">
                            <Terminal                                 
                                jobs={jobs}
                                checkpoint={checkpoint}
                                setCheckpoint={setCheckpoint}
                                props={{
                                    height: "500px",                                                                                                                                                
                                }}
                                />                                 
                        </Tabs.Panel>

                        <Tabs.Panel value="docker-compose">                                                        
                            <Code style={{height: "500px"}} color="black" c="white" block>{composeFile}</Code>
                        </Tabs.Panel>
                    </Tabs>
                </Grid.Col>
            </Grid>
        </Container>
    )
}

export default ProvisionLB