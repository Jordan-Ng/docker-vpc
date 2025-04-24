import React, {useEffect, useState} from 'react'
import {Button as ButtonMan, ActionIcon, Modal, Space, Flex} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'


const DefaultButton = ({props, customHandler}) => {
    const [disabled, setDisabled] = useState(false)
    const [loading, {open: disable, close: enable}] = customHandler || useDisclosure(false)

    
    const handleClick = async () => {
        
        disable()
        if (props?.onClick && typeof props.onClick  === "function"){            
            await props.onClick()
        }               
        enable()        
    }    
    
    return(
        <>
        {props?.type === 'icon-only' ?
        <ActionIcon
            size={36}
            loading={loading}
            onClick={handleClick}
            {...props?.button}
        >
            {props.button.icon}
        </ActionIcon>
        : 
        <ButtonMan                         
            onClick={handleClick}
            loading={loading}
            {...props?.button}
        >
            {props.button.text}
        </ButtonMan>
        }
        </>
    )
}

const ButtonModal = ({props, customHandler}) => {
    const [opened, {open, close}] = customHandler || useDisclosure(false)
    const Child = props?.child

    const handleOpen = async () => {
        if (props?.onOpen && typeof props.onOpen === "function"){
            await props.onOpen()
        }
        open()
    }

    const handleClose = async() => {        
        if (props?.onClose && typeof props.onClose === "function"){
            await props.onClose()
        }
        close()
    }

    return(
        <>
            <Modal 
                opened={opened} 
                onClose={handleClose} 
                title={props?.modal?.title || ''}
                size={props?.modal?.size || "xl"}
                {...props?.modal}
            >
                {/* {Child} */}                
                <Child props={{
                    close,
                    ...props.childState                                        
                }}

                />
            </Modal>
            
            {props?.type === "icon-only" ? 
            <ActionIcon
                size={36}
                onClick={handleOpen}
                {...props?.button}
            >{props.button.icon}</ActionIcon>
            :
            <ButtonMan variant={props?.button?.variant} onClick={handleOpen} {...props?.button}>
                {props?.button?.text || ""}
            </ButtonMan>}
        </>
    )
}

const Combo = ({propsArray}) => {
    const [loading, {open, close}] = useDisclosure(false)

    const registry = {
        'default' : (props, ind ) => <DefaultButton key={ind} props={props} customHandler={[loading, {open, close}]}/>,
        'modal' : (props, ind) => <ButtonModal key={ind} props={props} customHandler={[loading, {open, close}]}/>,
    }

    return(
        <>
        {propsArray?.map((item, ind) => {            
            return(
                <Flex key={ind}>                    
                {registry[item.variant](item.props, ind)}                                               
                {ind < propsArray.length -1 && <Space w="xs" /> }
                </Flex>
            )
        })}
        </>
    )
}



const Button = ({variant, props, propsArray}) => {
    
    const registry = {        
        'default' : <DefaultButton props={props}/>,
        'modal' : <ButtonModal props={props}/>,
        'combo' : <Combo propsArray={propsArray} />
    }

    return registry[variant]
}

export default Button
