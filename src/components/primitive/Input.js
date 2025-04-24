import React, {useState, useEffect} from 'react'
import {TextInput as TextInputMan} from '@mantine/core'
// text input
    // enable custom validation + validation message
    // custom onChange
// number input
// Switch
// select
// tags
const TextInput = ({props}) => {
    return(<TextInputMan {...props?.input}/>)
}

const Input = ({variant, props}) => {
    const inputType = {
        "text": <TextInput props={props}/>
    }

    return inputType[variant]
}

export default Input