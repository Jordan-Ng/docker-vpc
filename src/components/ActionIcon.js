import React from 'react'
import { ActionIcon as ActionIconMan} from '@mantine/core'

export default function ActionIcon({props}){
    return(
        <ActionIconMan color={props?.color ? props.color : "blue"} onClick={props?.onClick} 
            style={{
                height: "36px",
                width: "36px",
                marginRight: "5px"
            }}
        >
            <props.icon style={props?.iconStyle}/>
        </ActionIconMan>
    )
}