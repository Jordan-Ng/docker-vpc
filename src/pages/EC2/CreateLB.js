import React, {useState, useEffect} from 'react'
import {Container, SimpleGrid, Space, Text, Box, TextInput, Group, Tabs, Flex, Switch, Select, NumberInput, Tooltip, Chip} from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import useCreateLB_hooks from '../../helpers/hooks/EC2/useCreateLB'
import { Input, Card, Button } from '../../components'

const CreateLB = () => {
    const {lbSummary, machineImages, populateMachineImages, onFieldChange, handleSubmit}  = useCreateLB_hooks()

    useEffect(() => {
        populateMachineImages()
    },[])
    
    return(
        <Container>
            <Text size="lg">Application Load Balancers</Text>
            <Text size="xs">Horizontally scale your application with the help of layer 7 application load balancers</Text>

            <SimpleGrid cols={2}>
                <Box>
                    <Space h="lg"/>
                    <Card
                        props={{title: "Basic Configuration"}}
                    >

                                   
                        <Input 
                            variant="text"
                            props={{
                                input: {
                                    label: "Load Balancer Name",
                                    required: true,
                                    onChange: e => onFieldChange("name", e.target.value)
                                }

                            }}
                        />
                        <Text size="xs" c="blue">Note: "lb-" will be prefixed</Text>
                    </Card>

                    <Space h="md"/>

                    <Card
                        props={{title: "Listeners and Routing"}}
                    >
                        <Flex>
                            <TextInput 
                                disabled
                                label="Protocol"
                                value="HTTP"
                            />
                            <Space w="xs"/>
                            <TextInput 
                                disabled
                                label="Port"
                                value="80"
                            />
                        </Flex>

                        <Space h="md"/>

                        <Switch 
                            label="I plan to setup a reverse proxy/API gateway in front of this load balancer"
                            description="Target Group will be exposed on host's port 80 if unchecked. If you plan to set up a reverse proxy for this service later, please check this box to avoid port conflicts"
                            color="teal"
                            checked={lbSummary.is_behind_reverse_proxy}
                            onClick={() => onFieldChange("is_behind_reverse_proxy", !lbSummary.is_behind_reverse_proxy)}                            
                        />
                    </Card>

                    <Space h="md"/>

                    <Card
                        props={{title: "Services"}}
                    >
                        <Text size="xs" c="blue">Define services to place behind this load balancer</Text>

                        <Space h="sm"/>

                        <Select 
                            placeholder="Machine Image"  
                            data={machineImages} 
                            onChange={val => onFieldChange("machine_image", val)}                       
                        />

                        <Space h="sm"/>

                        <NumberInput
                            placeholder=" Application Port"
                            hideControls   
                            rightSection={
                                <Tooltip position="right-end" color="blue" label="Port where this application will be running from">
                                    <IconInfoCircle size={20} stroke={1.5} color="lightGray"/>
                                </Tooltip>            
                            }
                            min={1024}
                            max={65535}
                            onChange={val => onFieldChange("port", val)}                         
                        />

                        <Space h="sm"/> 

                        <NumberInput
                            placeholder="# of replicas needed"
                            onChange={val => onFieldChange("no_of_replicas", val)}
                            defaultValue={1}
                            min={1}
                            max={5}                        
                        />
                    </Card>

                </Box>

                <Box>
                <Space h="lg"/>
                    <Card
                            props={{title: "Summary"}}
                        >
                        <Tabs variant="outline" defaultValue="Summary">
                            <Tabs.List>
                                <Tabs.Tab value="Summary">
                                    <Text size="xs"> Configuration</Text>
                                </Tabs.Tab>

                                <Tabs.Tab value="Services">
                                    <Text size="xs"> Services</Text>
                                </Tabs.Tab>

                            </Tabs.List>

                            <Tabs.Panel value="Summary">
                                
                                <Space h="lg"/> 
                                <Group>
                                <Text c="blue" size="sm" fw={700}>Load Balancer Name</Text>
                                </Group>
                                <Text size="sm">lb-{lbSummary.name}</Text>
                                <Space h="xl"/>                                 
                                {lbSummary.is_behind_reverse_proxy ? <Chip defaultChecked onChange={() => onFieldChange("is_behind_reverse_proxy", !lbSummary.is_behind_reverse_proxy)}  color="green">Behind Reverse Proxy</Chip> : <Space h={27}/>}

                                
                            </Tabs.Panel>

                            <Tabs.Panel value="Services">
                                

                                <Space h="lg"/> 
                                <Text c="blue" size="sm" fw={700}>Service Image</Text>
                                <Text size="sm">{lbSummary.machine_image}</Text>

                                <Space h="lg"/> 
                                <Text c="blue" size="sm" fw={700}>Service Port</Text>
                                <Text size="sm">{lbSummary.port}</Text>

                                <Space h="lg"/> 
                                <Text c="blue" size="sm" fw={700}># of services in target group</Text>
                                <Text size="sm">{lbSummary.no_of_replicas}</Text>
                                
                            </Tabs.Panel>
                        </Tabs>
                        <Space h="sm"/>
                        <Flex >
                            <Button 
                                variant="default"
                                props={{
                                    onClick: handleSubmit,
                                    button: {
                                        text: "Create Load Balancer",
                                        fullWidth: true,
                                        disabled: Object.values(lbSummary).filter(val => val === undefined).length > 0
                                    }
                                }}
                            />
                        </Flex>
                    </Card>
                </Box>
            </SimpleGrid>

        </Container>
    )
}

export default CreateLB