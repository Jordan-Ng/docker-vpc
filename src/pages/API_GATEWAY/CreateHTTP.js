import { Container, Stepper, Stack, TextInput, Text, Space, Radio, Group, Flex, Badge, MultiSelect} from '@mantine/core'
import React, { useEffect, useRef } from 'react'
import { Button, Card, Input, AddServicedRoutes } from '../../components'
import useCreateHTTP_hooks from '../../helpers/hooks/API_GATEWAY/useCreateHTTP'
import { IconArrowRight } from '@tabler/icons-react'


const ConfigureAPI = ({props}) => {
    return(
    <Card props={{title: "API details"}}>
        
        <TextInput 
            size="sm"
            label="API Gateway Name"
            description="API gateway identifier"
            style={{width: "500px"}}
            onChange={e => props.handleFieldChange("name", e.target.value)}
            value={props.configSummary.name}
        />
        <Text size="xs" c="gray">* GW_ will be prefixed</Text>

        <Space h="xl"/>

        
        <Text size="sm">Integrations ({props.configSummary.integrations.length})</Text>
        <Text w="700px" size="xs" c="gray">
            Specify the backend services that your API will communicate with. 
            These are called integrations. For a HTTP integration, 
            API Gateway sends the request to the URL that you specify 
            and returns the response from the URL</Text>
        
        <Space h="sm" />

        <MultiSelect             
            placeholder="Select one or more services"
            data={props.integrationOptions}        
            onChange={selectionArray => props.handleFieldChange("integrations", selectionArray)}
            style={{width: "500px"}}
            value={props.configSummary.integrations}
        />

        <Space h="xl"/>

        <Text size="sm">IP Address Type</Text>
        <Space h="sm"/>
        <Stack>
            <Radio readOnly checked={true} label="IPv4" description="includes only IPv4 addresses"/>
            <Radio disabled label="Dualstack" description="includes IPv4 and IPv6 addresses"/>
        </Stack>


        <Space h="xl"/>
        <Space h="xl"/>
        <Flex style={{justifyContent: "flex-end"}}>
            <Button 
                variant="default"
                props={{
                    onClick: props?.next,
                    button: {
                        text: "Next",
                        size: "xs",
                        color: "yellow",                        
                        disabled: !props.configSummary.name || props.configSummary.integrations.length == 0
                    }
                }}
            />
        </Flex>
    </Card>)
}

const ConfigureRoutes = ({props}) => {
    return(
        <Card props={{title:"Configure Routes"}}>
            <Text size="sm">
                API Gateway uses routes to expose integrations to consumers of your API. 
                Routes for HTTP APIs consists of two parts: a HTTP method and a resource path (e.g. GET /pets).
                You can define specific HTTP methods for your integration. 
            </Text>

            <Space h="xl"/>

            <AddServicedRoutes ref={props.servicedRoutesRef} serviced_routes={props.configSummary.serviced_routes} integrations={props.configSummary.integrations}/>

            <Space h="xl"/>
            <Space h="xl"/>
            <Flex justify="flex-end">
                <Button                     
                        variant="combo"
                        propsArray={[
                            {
                                variant: "default",
                                props:{
                                    onClick: props.back,
                                    button: {
                                        size: "xs" ,
                                        text: "Back",
                                        variant: "outline",
                                        color: "gray"                                   
                                }}
                            },
                            {
                                variant: "default",
                                props: {
                                    onClick: () => {
                                        props.handleFieldChange("serviced_routes", props.servicedRoutesRef.current.getServicedRoutes())
                                        props.next()
                                    },
                                    button: {
                                        size: "xs",
                                        text: "Next",
                                        color: "yellow"                                        
                                }}
                            }
                        ]}
                    
                />
            </Flex>            
        </Card>
    )
}

const ReviewAndCreate = ({props}) => {    

    return(
        <>            
            <Card props={{title: "API Name and integrations"}}>
                <Flex>
                    <Stack gap='xs'>
                        <Text fw={700}  c="blue" size='sm'>API Name</Text>
                        <Text size="xs">GW_{props.configSummary.name}</Text>
                    </Stack>

                    <Space w="xl"/>
                    <Space w="xl"/>
                    <Space w="xl"/>

                    <Stack gap='xs'>
                        <Text fw={700}  c="blue" size='sm'>IP Address Type</Text>
                        <Text size="xs">IPv4</Text>
                    </Stack>
                </Flex>

                <Space h="xl"/>
                <Stack gap='xs'>
                        <Text fw={700}  c="blue" size='sm'>Integrations</Text>
                        <Flex>                            
                            {props.configSummary.integrations.map((svc, ind) => <Group key={ind}>
                                <Badge>{svc}</Badge>
                                <Space w="sm"/>
                            </Group>)}
                        </Flex>
                </Stack>
            </Card>
            <Card props={{title: "Routes"}}>
                
                <Stack gap="xs">
                {props.configSummary["serviced_routes"].map((routeObj, ind) => (
                    
                        <Flex key={ind}>
                            <Text size="sm">ANY {routeObj.resource_path}</Text>
                            <Space w="sm"/>
                            <IconArrowRight size={20} stroke={.5}/>
                            <Space w="sm"/>
                            <Badge>{routeObj.integration_target}</Badge>
                        </Flex>                                            

                ))}
                </Stack>

                <Space h="xl"/>
                <Space h="xl"/>
                <Flex justify="flex-end">
                    <Button                     
                            variant="combo"
                            propsArray={[
                                {
                                    variant: "default",
                                    props:{
                                        onClick: props.back,
                                        button: {
                                            size: "xs" ,
                                            text: "Back",
                                            variant: "outline",
                                            color: "gray"                                   
                                    }}
                                },
                                {
                                    variant: "default",
                                    props: {    
                                        onClick: props.handleSubmit,                                
                                        button: {
                                            size: "xs",
                                            text: "Create",                                                                                
                                    }}
                                }
                            ]}
                        
                    />
                </Flex>                      
                
            </Card>              
        </>
    )
}

const CreateHTTP = () => {
    const {active, setActive, next, back, configSummary, populateIntegrationOptions, integrationOptions, handleFieldChange, handleSubmit} = useCreateHTTP_hooks()
    const servicedRoutesRef = useRef()

    useEffect(() => {
        populateIntegrationOptions()
    }, [])
        
    const formPage = {
        "0" : <ConfigureAPI props={{next, back, configSummary, integrationOptions, handleFieldChange}}/>,
        "1" : <ConfigureRoutes props={{next, back, configSummary, servicedRoutesRef, handleFieldChange}}/>,
        "2" : <ReviewAndCreate props={{back, configSummary, handleSubmit}}/>
    }


    return(
        <Container>
                <Space h="xl"/>
            
                <Stepper size="sm" active={active} onStepClick={setActive} allowNextStepsSelect={false} styles={{separator : {background :"teal"}}} >
                    <Stepper.Step label="Configure API" description="Configure API Gateway ID and Service Integrations">                        
                    </Stepper.Step>
                    <Stepper.Step label="Configure Routes" description="Configure API Gateway Routes for Service Integrations">
                    </Stepper.Step>
                    <Stepper.Step label="Review" description="Review and Create">
                    </Stepper.Step>
                </Stepper>

                <Space h="xl"/>
            
            {formPage[active]}
        </Container>
        
    )
}

export default CreateHTTP