import React, {useState, useEffect, useRef} from "react"
import {Container, Text, TextInput, SimpleGrid, Select, Textarea, Button, Group, Space, Checkbox, Badge, Pill, Loader} from "@mantine/core"
import {IconCheck, IconX} from "@tabler/icons-react"
import {Card, Input, UserScriptForm} from "../components"
import INSTANCE_TYPES from "../constants/INSTANCE_TYPES.json"
import fx from "../helpers/fx"

const CreateInstances = () => {
    const userScriptRef = useRef()
    const [instanceTypes, setInstanceTypes] = useState({})
    const [timer, setTimer] = useState(null)

    const [validName, setValidName] = useState(undefined)
    

    const [summary, setSummary] = useState({
        instanceName : undefined,
        image: undefined,
        instanceType: undefined,
        volume: undefined,
        allowHTTP: false,
        allowHTTPS: false
    })
    
    const [options, setOptions] = useState({
        name: undefined,
        images: undefined,
        ami: undefined,
        instance_types : INSTANCE_TYPES,
        volume: undefined
    })    

    useEffect(() => {      
        const catalog = {}

        // create object catalog for all instance types
        Object.keys(INSTANCE_TYPES).map(fam => {
            INSTANCE_TYPES[fam].forEach((instType, ind) => {
                catalog[instType["Instance Size"]] = {
                    ...INSTANCE_TYPES[fam][ind],
                    family : fam
                }
            })
        })

            
        let availableVolumes 
        fx.volume.list().then(data => {
            availableVolumes = JSON.parse(data).map(vol => vol["name"])
            // console.log(availableVolumes)
        })

        // populate select input for images
        fx.ec2.list_os_images().then(os_imgs => {
            const os_images = JSON.parse(os_imgs)
            const ami = [];
            const images = [];
            
            os_images.forEach(os_image => {
                const img_name = os_image.repo[0].split(":")[0] 
                
                if (img_name == "hello-world") return
                
                if (os_image.labels?.isAMI){
                    ami.push(img_name)
                    return
                }
                images.push(img_name)
            })        
            
            setInstanceTypes(catalog)  
            setOptions({
                ...options,
                ami,
                images,
                volume : availableVolumes
            })
        }) 

    }, [])

    const handleTextChange = (e) => {
        setValidName(undefined)
        setSummary({
            ...summary,
            instanceName: e.target.value
        })

        clearTimeout(timer)

        const newTimer = setTimeout(async () => {            
             setValidName(await fx.ec2.is_valid_instance_name(e.target.value.replace(/\s+/g, '-')))
            
        }, 1000)

        setTimer(newTimer)
    }
    

    const handleSelect = (val, opt, field) => {
        
        const newState = {
            ...summary
        }
        
        newState[field] = val

        if (field === "instanceType") {            
            newState[field] = instanceTypes[val]

            if (!instanceTypes[val]["EBS Only"]){
                newState.volume = null
            }
        }

        
        setSummary(newState)        
    }

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
                    label="Name" 
                    placeholder='e.g. my-first-instance'
                    onChange={handleTextChange}
                    />
                    </Card>

                    <Card 
                        props = {{
                            title: "Application and OS Images (Docker Images)",
                            style: {
                                marginTop: "20px"
                            }                    
                        }}
                    >
                    <Select 
                        data={[
                            { group: "Base Images", items: options.images || [] },
                            { group: "AMI", items: options.ami || []}                           
                        ]}
                        placeholder="select an option"
                        onChange={(val, opt) => handleSelect(val, opt, "image")}     
                    />
                    </Card>

                    <Card 
                        props = {{
                            title: "Instance Type",
                            style: {
                                marginTop: "20px"
                            }                    
                        }}
                    >
                    <Select 
                        data={Object.keys(options.instance_types).map(key => ({
                            group: key,
                            items: options.instance_types[key].map(obj => obj["Instance Size"])
                        }))}
                        placeholder="select an option"                        
                        onChange={(val, opt) => handleSelect(val, opt, "instanceType")}                        
                    />

                    </Card>

                    <Card 
                        props = {{ 
                            title: "Configure Storage",
                            style: {
                                marginTop: "20px"
                            }      
                        }}
                    >
                    <Select 
                        disabled = {summary.instanceType == undefined ? true : !summary.instanceType["EBS Only"] }
                        placeholder={summary.instanceType ? !summary.instanceType["EBS Only"] ? "Persistent Only" : "Select an Option" : "No Information"}
                        data = {options.volume}  
                        value = {summary.volume}                      
                        onChange={(val, opt) => handleSelect(val, opt, "volume")}
                    />
                    </Card>

                    <Card 
                        props = {{
                            title: "Network Settings",
                            style: {
                                marginTop: "20px"
                            }      
                        }}
                    >
                    <TextInput label="Network (Docker Bridge)" disabled placeholder="Coming Soon .."/>
                    <Space h="sm"/>                    
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

                    </Card>

                    <Card 
                        props = {{
                            title: "User Data - optional",
                            style: {
                                // marginTop: "20px"
                            }      
                        }}
                    >                    
                    <UserScriptForm                         
                        ref = {userScriptRef}
                    />
                    </Card>

                </div>
                
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
                        {summary.instanceName && validName == undefined ? <Loader size={15} color="yellow" type="dots" /> : ""}
                        {summary.instanceName && validName != undefined ? validName ? <IconCheck size={15} color="green"/> : <IconX size={15} color="red"/> : "" }
                        
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
                                <Text size="xs">{summary.instanceType["EBS Only"] ? summary.volume : summary.instanceType["Instance Storage"]  }</Text>
                            </> : ""}
                        </Group>
                        
                        <Space h="xl"/>
                        <Group>
                            {summary.allowHTTP ? <Pill withRemoveButton onRemove={() => handleSelect(!summary.allowHTTP, "", "allowHTTP")}>AllowHTTP</Pill> : ""}            
                            {summary.allowHTTPS ? <Pill withRemoveButton onRemove={() => handleSelect(!summary.allowHTTPS, "", "allowHTTPS")}>AllowHTTPS</Pill> : ""}            
                        </Group>

                        <Space h="xl"/>
                        <Space h="xl"/>
                        <Button fullWidth onClick={() => {
                            const scripts = userScriptRef.current.getUserScripts()
                            console.log(scripts)
                        }}>Launch Instance</Button>
                    </Card>
                    
                </div>
            </SimpleGrid>
        </Container>
    )
}

export default CreateInstances