import React, {useEffect, useRef} from "react"
import {Container, Text, TextInput, SimpleGrid, Select, MultiSelect, TagsInput, Textarea, Button, Group, Space, Checkbox, Badge, Pill, Loader} from "@mantine/core"
import {Card, PortMapper, UserScriptForm} from "../../components"
import {IconCheck, IconX} from "@tabler/icons-react"
import useEC2Creation_hooks from "../../helpers/hooks/EC2/createInstance"

const CreateInstances = () => {
    
    const userScriptRef = useRef()
    const {
        isValidName, 
        summary, 
        portMappings,
        options, 
        addPortError,
        handleTextChange, 
        populateInputOptions, 
        handleSelect,
        handleAdditionalPortSelection,
        handleRemoveAdditionalPort,
        handleChangePortMapping,
        handleAddEntryPointCommand,
        handleNetworkChange,
        handleFormSubmit        
    } = useEC2Creation_hooks()

    useEffect(() => {             
        populateInputOptions()
    },[])    

    return(
        <Container>
            <Text size="lg" fw={500}>Launch an instance</Text>
            <Text size="sm">Create containers that run in your private docker environment. Quickly get started by following the simple steps below.</Text>

            <SimpleGrid cols={2}>
                <div>
                    <Space h="lg"/>

                    <Card 
                        props = {{
                            title: "Name and Tags",                    
                        }}
                    >
                        <TextInput 
                        required
                        label="Name" 
                        placeholder='e.g. my-first-instance'
                        onChange={handleTextChange}
                        value={summary.instanceName || ""}
                        
                    
                        {...summary.instanceName === null || summary.instanceName?.length < 3 ?
                            {error: "Please Enter a Valid Instance Name (min. 3 characters)"} :

                            !isValidName && isValidName !== undefined ? 
                            {error: "Instance Name Already Exists"} : {}
                        }
                        
                        />
                    </Card>
                    
                    <Space h="sm"/>

                    <Card 
                        props = {{
                            title: "Application and OS Images (Docker Images)",                                                
                        }}
                    >
                        <Select 
                            label="Base Image"
                            required
                            data={[
                                { group: "Base Images", items: options.images || [] },
                                { group: "AMI", items: options.ami || []}                           
                            ]}
                            placeholder="select an option"
                            value={summary.image}
                            onChange={(val, opt) => handleSelect(val, opt, "image")}     
                            {...summary.image === null ? {error: "Please select an option"} : {}}                        

                        />
                    </Card>
                    
                    <Space h="sm"/>

                    <Card 
                        props = {{
                            title: "Instance Type"                                               
                        }}
                    >
                        <Select 
                            label="Instance Type"
                            required
                            data={Object.keys(options.instance_types).map(key => ({
                                group: key,
                                items: options.instance_types[key].map(obj => obj["Instance Size"])
                            }))}
                            value={summary.instanceType["Instance Size"]}
                            placeholder="select an option"                        
                            onChange={(val, opt) => handleSelect(val, opt, "instanceType")}
                            {...summary.instanceType === null ? {error: "Please select an option"} : {}}                        
                        />

                    </Card>
                    
                    <Space h="sm"/>

                    <Card 
                        props = {{ 
                            title: "Configure Storage"                                  
                        }}
                    >
                        <Select 
                            label="Storage"
                            disabled = {summary.instanceType == undefined ? true : !summary.instanceType["EBS Only"] }
                            placeholder={summary.instanceType ? !summary.instanceType["EBS Only"] ? "Persistent Only" : "Select an Option" : "No Information"}
                            data = {options.volume}  
                            value = {summary.volume}                      
                            onChange={(val, opt) => handleSelect(val, opt, "volume")}
                            {...summary.volume === null && summary.instanceType?.["EBS Only"] ? {error: "Please select an option"} : {}}
                        />
                        <Text size="xs" c="gray">Mountpoint will be in instance's /home/vol</Text>  
                    </Card>
                    
                    <Space h="sm"/>

                    <Card 
                        props = {{
                            title: "User Data - optional"                            
                        }}
                    >                    
                        <UserScriptForm                         
                            ref = {userScriptRef}
                        />
                    </Card>

                    <Space h="sm"/>

                    <Card 
                        props = {{
                            title: "Network Settings",                                
                        }}
                    >
                    
                        <Select 
                            label = "Network to attach this instance to"
                            placeholder = "(default: bridge)"
                            // placeholder
                            data = {options.networks}
                            onChange={handleNetworkChange}
                            value={summary.network}
                            searchable
                        />
                        
                        <Space h="xl"/>                    
                                <Group style={{alignItems: "baseline"}}>
                                <Checkbox.Indicator
                                    checked={summary.allowHTTP} 
                                    onClick={() => handleSelect(!summary.allowHTTP, "" , "allowHTTP")}
                                />
                                <div>
                                    <Text size="sm">Allow HTTPS traffic from the internet</Text>
                                    <Text size="xs" c="gray">Expose ports 443, 8443</Text>                            
                                </div>
                                </Group>
                        <Space h="sm"/>
                        
                        <Group style={{alignItems: "baseline"}}>
                            <Checkbox.Indicator 
                                checked={summary.allowHTTPS} 
                                onClick={() => handleSelect(!summary.allowHTTPS, "" , "allowHTTPS")}
                            />
                            <div>
                                <Text size="sm">Allow HTTP traffic from the internet</Text>
                                <Text size="xs" c="gray">Expose port 80</Text>                            
                            </div>
                        </Group>

                        <Space h="sm"/>

                        <TagsInput 
                            label="Expose additional ports"
                            description="expose additional ports on the instance"
                            onChange={handleAdditionalPortSelection}
                            acceptValueOnBlur={false}
                            value={summary.additionalPorts}
                            error={addPortError.error && addPortError.message}                        
                        />

                    </Card>

                    <Space h="sm"/>

                    <Card 
                        props = {{
                            title: "Port Mappings"                              
                        }}
                    >            
                        <Text size="xs" c="dimmed">Map host to instance ports</Text>        

                        <Space h="sm"/>

                        <PortMapper                             
                            handleAdd={() => handleChangePortMapping("", "", "", "new")}
                            handleChange={(e,id,field) => handleChangePortMapping(e, id, field, "update")}
                            handleRemove={(id) => handleChangePortMapping("", id, "", "remove")}
                            store={portMappings}
                        />                    
                    </Card>
                    
                    <Space h="sm"/>
                    <Card
                        props={{
                            title: "Entrypoint"                            
                        }}
                    >
                        <TextInput 
                            required
                            label="Entrypoint Command"
                            placeholder="i.e npm start"
                            description="command to run on instance startup"
                            onChange={handleAddEntryPointCommand}
                            value={summary.entrypoint}
                            {...summary.entrypoint === null ? {error: "Please Enter a command to run on instance startup"} : ""}
                        />
                    </Card>
                </div>
            {/* =================================================================== */}
                <div>
                        <Space h="lg"/>

                        <Card
                            props={{
                                title: "Summary"
                            }}                        
                        >
                            <Group>
                                
                                <Text c="blue" size="sm" fw={700} >Instance Name</Text>
                                
                                {/* REFACTOR ME! */}
                                {summary.instanceName && isValidName == undefined ? <Loader size={15} color="yellow" type="dots" /> : ""}
                                {summary.instanceName && isValidName != undefined ? isValidName ? <IconCheck size={15} color="green"/> : <IconX size={15} color="red"/> : "" }
                            </Group>
                                
                            <Text size="sm">{summary.instanceName}</Text>
                            <Text c="blue" size="sm" fw={700} style={{marginTop: "20px"}}>Software Image (AMI)</Text>
                            <Text size="sm">{summary.image}</Text>

                            <Group>
                                <div>
                                    <Text c="blue" size="sm" fw={700} style={{marginTop: "20px"}}>Instance Type</Text>
                                    <Text size="sm">{summary.instanceType && summary.instanceType["Instance Size"]}</Text>
                                </div>

                                <div style={{margin: "20px 0 0 20px"}}>
                                    <Text c="blue" size="sm" fw={700} >vCPU</Text>
                                    <Text size="sm">{summary.instanceType && summary.instanceType["vCPU"]}</Text>
                                </div>

                                <div style={{margin: "20px 0 0 20px"}}>
                                    <Text c="blue" size="sm" fw={700} >Memory</Text>
                                    <Text size="sm">{summary.instanceType && summary.instanceType["Memory"] + "g"}</Text>
                                </div>
                            </Group>

                            <Text c="blue" size="sm" fw={700} style={{marginTop: "20px"}}>Storage (volumes)</Text>
                            
                            <Space h="xs"/>
                            
                            <Group>
                                {summary.instanceType ?
                                <>
                                    <Badge color={summary.instanceType["EBS Only"] ? "yellow"  : "purple" }>{summary.instanceType["EBS Only"] ? "EBS"  : "DISK"}</Badge>
                                    {/* <Text size="xs">{summary.instanceType["EBS Only"] ? summary.volume.join(", ") : summary.instanceType["Instance Storage"]  }</Text> */}
                                    <Text size="xs">{summary.instanceType["EBS Only"] ? summary.volume : summary.instanceType["Instance Storage"]  }</Text>
                                </> : ""}
                            </Group>

                            <Space h="xs"/>

                            <Text c="blue" size="sm" fw={700}>Networks</Text>
                            <Space h="xs"/>
                            <Group>
                                {/* {summary.networks && summary.networks.map((n,ind) => <Pill key={ind}>{n}</Pill>)} */}
                                {summary.network && <Pill>{summary.network}</Pill>}
                            </Group>
                            <Space h="xs"/>

                            <Text c="blue" size="sm" fw={700}>Ports Exposed</Text>
                            <Space h="xs"/>
                            <Group>
                                {summary.allowHTTP ? <Pill withRemoveButton onRemove={() => handleSelect(!summary.allowHTTP, "", "allowHTTP")}>HTTP (80)</Pill> : ""}            
                                {summary.allowHTTPS ? <Pill withRemoveButton onRemove={() => handleSelect(!summary.allowHTTPS, "", "allowHTTPS")}>HTTPS (443, 8443)</Pill> : ""}            
                                {summary.additionalPorts.map((port,ind) => <Pill withRemoveButton onRemove={() => handleRemoveAdditionalPort(port)} key={ind}>{port}</Pill>)}
                            </Group>

                            <Space h="xs"/>

                            <Text c="blue" size="sm" fw={700}>Port Mappings</Text>
                            <Group>
                                {portMappings.map((pm, ind) => <Pill key={ind}>{pm.from} : {pm.to}</Pill>)}                                
                            </Group>
                            
                            <Space h="xs"/>
                            <Text c="blue" size="sm" fw={700}>Entrypoint Command</Text>
                            <Text size='xs'>{summary.entrypoint}</Text>



                            <Space h="xl"/>
                            <Space h="xl"/>

                            <Button fullWidth onClick={() => handleFormSubmit(userScriptRef)}>Launch Instance</Button>
                        </Card>
                </div>
            </SimpleGrid>
        </Container>

    )
}

export default CreateInstances