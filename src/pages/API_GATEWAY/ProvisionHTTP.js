import React, {useState, useEffect} from "react"
import {Container, Grid, Timeline, Text, Flex, Loader, Space, Anchor, Center, Tabs, Code} from "@mantine/core"
import { Terminal } from "../../components"
import { IconTerminal, IconBrandDocker, IconCheck, IconFileAlert } from "@tabler/icons-react"
import useProvisionHTTP_hooks from "../../helpers/hooks/API_GATEWAY/useProvisionHTTP"

const ProvisionLB = () => {
    const {jobs, location, summary, setSummary, isFileReady, composeFile, traefikConfigFile, getConfigFiles, checkpoint, setCheckpoint} = useProvisionHTTP_hooks()
    
    useEffect(() => {        
        setSummary(location.state)
    }, [location])    

    useEffect(() => {        
        if (isFileReady) getConfigFiles()
    }, [isFileReady])    

    return(
        <Container p={0}>

            <Space h="xl"/>            
            {summary &&
            <Grid>
                <Grid.Col span={12}>
                    <Center>

                    {checkpoint == jobs.length ? 
                    <Flex><IconCheck style={{width: "15px", height: "15px"}} color="green"/><Space w="sm"/><Text size="sm">Provisioning Complete! <Anchor href="/" underline="hover">View API-GW Dashboard</Anchor></Text></Flex>
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

                            <Timeline.Item title="Scaffolding Dynamic Route Configurations">
                                <Text c="dimmed" size="sm">Generating traefik_dynamic.yml</Text>
                            </Timeline.Item>

                            <Timeline.Item title="Cross Checking services">
                                <Text c="dimmed" size="sm">Verifying integration targets are online</Text>
                            </Timeline.Item>      

                            <Timeline.Item title="Taking API Gateway Online">
                                <Text c="dimmed" size="sm">Starting API Gateway Service</Text>
                            </Timeline.Item>                        

                            <Timeline.Item title="Done!">                            
                                <Text c="dimmed" size="sm">API Gateway provisioned. {checkpoint == jobs.length && <Anchor href="/" underline="hover">View API-GW Dashboard</Anchor>}</Text>
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
                            <Tabs.Tab value="traefik-dynamic" leftSection={<IconFileAlert stroke={1} style={{width: "20px", height: "20px"}}/>}>
                                <Text size="xs">traefik-dynamic.yml</Text>
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

                        <Tabs.Panel value="traefik-dynamic">                                                        
                            <Code style={{height: "500px"}} color="black" c="white" block>{traefikConfigFile}</Code>
                        </Tabs.Panel>
                    </Tabs>
                </Grid.Col>
            </Grid>}
        </Container>
    )
}

export default ProvisionLB