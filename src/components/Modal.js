import React from 'react'
import {Modal as ModalMan, Button as ButtonMan} from "@mantine/core"
import { useDisclosure } from '@mantine/hooks'

export default function Modal({props}) {
    const [isOpen,  {open, close}] = useDisclosure(false)
        

    return(
        <>
            <ModalMan opened={isOpen} onClose={close} size="xl" title={props?.modalTitle || ""} withCloseButton={props?.showCloseButton || false}>                
                {props?.child ? <props.child 
                close={close} 
                onClickHandler={props?.onClickHandler || null} 
                states={props?.childState || null}                
                /> 
                : ""}
            </ModalMan>

            <ButtonMan 
            color={props?.color ? props.color : ""} 
            rightSection={props?.rightIcon}
            style={props?.buttonStyle}
            onClick={open}
            disabled={props?.buttonDisabled}
            variant={props?.variant}
            fullWidth={props?.buttonFullWidth}
            >

                {props?.buttonText}
            </ButtonMan>
        </>


    )
}