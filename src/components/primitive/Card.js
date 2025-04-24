import React from 'react'
import {Card as CardMan, Group, Text, TextInput} from "@mantine/core"

const Card = ({props, children}) => {    

    return (
        <CardMan shadow="sm" padding="lg" style={{
            ...props?.style
            }}>
                <div style={{display: "flex", flexDirection:"column", height: "100%" , justifyContent: "space-between"}}>
                    
                    <div>
                        {props?.title ? <Text 
                        size="sm" 
                        fw={800} 
                        style={{borderBottom: "2px solid whitesmoke", paddingBottom: "10px", marginBottom: "10px"}}>
                            {props.title}
                        </Text> : ""}
                        {children}
                    </div>
                    
                    
                    {props?.footerChild}                                    
                </div>
        </CardMan>
    )
}

export default Card