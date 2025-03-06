import React, {useState, useEffect} from "react"
import {Container, Text, TextInput, Button, Group, Space, Select, Chip, Switch, Flex, SimpleGrid, Tabs, NumberInput, Tooltip} from "@mantine/core"
import {IconInfoCircle} from '@tabler/icons-react'
import { Card, Modal, AddServices } from "../../components"
import useEC2CreateLB_hooks from "../../helpers/hooks/EC2/useCreateLB"


const CreateLB = () => {
    const {lb_summary, images, onChange, populateMachineImages, handleSubmit} = useEC2CreateLB_hooks()

    useEffect(() => {
        populateMachineImages()
    }, [])

    return(
        <Container>
            <Text size="lg">Load Balancers</Text>
            <Text size="sm">Horizontally scale your application with the help of load balancers</Text>

            <SimpleGrid cols={2}>
                <div>
                    <Space h="lg"/>
                    <Card
                        props= {{title: "Basic Configuration"}}
                    >
                        <TextInput 
                            required
                            label="Load balancer name"
                            onChange={e => onChange("name", e.target.value)}
                        />
                        <Text size="xs" c="gray">lower case + no special characters</Text>
                    </Card>

                    <Space h="sm"/>
                    <Card
                        props= {{title: "Listeners and Routing"}}
                    >
                        <Group>
                            <TextInput 
                                disabled
                                label="Protocol"
                                value="HTTP"                                
                            />
                            <TextInput 
                                disabled
                                label="Port"
                                value="80"                                
                            />
                            
                        </Group>
                                                    
                        <Space h="md"/>

                        <Switch 
                        label="I plan to setup a reverse proxy/API gateway in front of this load balancer"
                        description="Target Group will be exposed on host's port 80 if unchecked. If you plan to set up a reverse proxy for this service later, please check this box"
                        color="teal"
                        onClick={() => onChange("behind_reverse_proxy", !lb_summary.behind_reverse_proxy)}                            
                        />

                        <Space h="md"/>
                        
                        
                        <Text size="md">Services</Text>                        
                        <Text size="xs" c="gray">Define services to place behind this load balancer</Text>
                        
                        <Space h="sm"/>

                        <Select 
                            placeholder="Machine Image"  
                            data={images} 
                            onChange={val => onChange("machine_image", val)}                       
                        />

                        <Space h="sm"/>

                        <NumberInput
                            placeholder="Port"
                            hideControls   
                            rightSection={
                                <Tooltip position="right-end" color="blue" label="Port where this application will be running from">
                                    <IconInfoCircle size={20} color="lightGray"/>
                                </Tooltip>            
                            }
                            min={1024}
                            max={65535}
                            onChange={val => onChange("port", val)}                         
                        />
                        
                        <Space h="sm"/>

                        <NumberInput
                            placeholder="# of replicas needed"
                            onChange={val => onChange("no_of_replicas", val)}
                            min={1}
                            max={5}                        
                        />
                    </Card>

                    <Space h="sm"/>
                    
                </div>

                <div>
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
                                {lb_summary.behind_reverse_proxy && <Chip defaultChecked  color="green">Behind Reverse Proxy</Chip>}
                                </Group>
                                <Text size="sm">lb-{lb_summary.name}</Text>

                                <Space h="xl"/> 
                                {/* <Text c="blue" size="sm" fw={700}>Behind Reverse Proxy?</Text>
                                <Text size="sm">{lb_summary.behind_reverse_proxy.toString()}</Text> */}

                                
                            </Tabs.Panel>

                            <Tabs.Panel value="Services">
                                

                                <Space h="lg"/> 
                                <Text c="blue" size="sm" fw={700}>Service Image</Text>
                                <Text size="sm">{lb_summary.machine_image}</Text>

                                <Space h="lg"/> 
                                <Text c="blue" size="sm" fw={700}>Service Port</Text>
                                <Text size="sm">{lb_summary.port}</Text>

                                <Space h="lg"/> 
                                <Text c="blue" size="sm" fw={700}># of services in target group</Text>
                                <Text size="sm">{lb_summary.no_of_replicas}</Text>
                                
                            </Tabs.Panel>
                        </Tabs>
                        <Space h="sm"/>
                        <Flex >
                            <Button fullWidth onClick={handleSubmit}>Create Load Balancer</Button>
                        </Flex>
                    </Card>
                </div>
            </SimpleGrid>
        </Container>
    )
}

export default CreateLB