import React, {useState, useEffect} from 'react'
import { Badge, Flex} from '@mantine/core'
import {Button} from '../../../components'
import fx from '../../fx'

const useEC2Dashboard_hooks = () => {
    const [instances, setInstances] = useState(undefined)
    const [isVisible, setIsVisible] = useState(true)
    const [childMessage, setChildMessage] = useState("")           

    const getInstances = async () => {
        const exitObj = await fx.ec2.list_instances()
        
        const formatted = JSON.parse(exitObj)

        setInstances(formatted.map(dt => ({
            id: dt["ID"],
            image: dt["Image"],
            command: dt["Command"],
            mounts: dt["Mounts"],
            name: dt["Names"],
            state: <Badge color={dt["State"] == "exited" ? "yellow" : "blue"}>{dt["State"]}</Badge>,
            networks: dt["Networks"],
            action: dt["State"] == "running" ? 
                <Flex>                    
                    <Button 
                        variant="combo"
                        propsArray={[
                            {
                                variant:"default",
                                props: {
                                    onClick: async() => await sshInstance(dt["Names"]),
                                    button: {
                                        size: "xs",
                                        text: "Connect"
                                    }
                                }
                            },
                            {
                                variant: "default",
                                props: {
                                    onClick: async() => await stopInstance(dt["Names"]),
                                    button: {
                                        size: "xs",
                                        text: "Stop",
                                        color: "red"
                                    }
                                }
                            }
                        ]}
                    />
                </Flex>  
                : 
                <Button 
                    variant="default"
                    props={{
                        onClick: async() => await startInstance(dt["Names"]),
                        button: {
                            size: 'xs',
                            text: "Start"
                        }
                    }}
                />                                            
            })))
        }
        
        const startInstance = async(vi_name) => {
            const isSuccessful = await fx.ec2.start_instance(vi_name)
            if (isSuccessful) {
                fx.base.notify(`Started ${vi_name} successfully`)
                /*
                Setting Timeout so that ephemeral containers have enough time 
                to exit before getting updated instances information
                */                             
                return new Promise(resolve => {
                    setTimeout(getInstances, 1000)
                })
            }
            fx.base.notify(`Unable to start ${vi_name}`, 'error')
        }

        const stopInstance = async(vi_name) => {
            const isSuccessful = await fx.ec2.stop_instance(vi_name)
            if (isSuccessful) {
                fx.base.notify(`Stopped ${vi_name} successfully`)
                getInstances()
                return
            }
            fx.base.notify(`Unable to stop ${vi_name}`, 'error')
        }

        const sshInstance = async(vi_name) => {
            setIsVisible(false)

            await fx.ec2.ssh_instance(
                vi_name,
                message => setChildMessage(message), // on stddout handler
                () => (setChildMessage(""), setIsVisible(true)) // onExit handler 
            )
        }
        
        const deleteInstances = async(targets) => {
            const isSuccessful = await fx.ec2.delete_instances(targets)
            if (isSuccessful) {
                fx.base.notify(`Removed instance(s) successfully`)
                getInstances()
                return
            }
            fx.base.notify(`Unable to remove instance(s)`, 'error')
        }


    return {getInstances, instances, isVisible, childMessage, deleteInstances}
}

export default useEC2Dashboard_hooks
