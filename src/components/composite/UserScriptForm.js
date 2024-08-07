import React, {useState, forwardRef, useImperativeHandle} from "react"
import { TextInput as InputMan, Flex, Text, Space, Badge, Divider, Button } from "@mantine/core"
import { IconX } from "@tabler/icons-react"

const UserScriptRow = ({id, actionArray, state, setState}) => {
    const [timer, setTimer] = useState(null)

    const handleRemove = () => {
        const newList = [...state[actionArray[0]]]
        newList[id] = ""

        setState({
            ...state,
            [actionArray[0]] : newList
        })
    }

    return(
        <Flex justify="space-between">            
                {actionArray[0] != "RUN" ? <><InputMan 
                    disabled 
                    placeholder={actionArray[0]}
                    value={actionArray[0]} 
                    style={{width: "20%"}}/>

                <InputMan
                    style={{width: "39%"}}                    
                    key={id}
                    onChange={e => {
                        
                        clearTimeout(timer)

                        const newTimer = setTimeout(() => {
                            const newScriptArray = state[actionArray[0]]
                            newScriptArray[id][1] = e.target.value
                            
                            setState({
                                ...state,
                                [actionArray[0]] : newScriptArray
                            })

                        }, 1000)

                        setTimer(newTimer)
                    }}
                /> 

                <InputMan 
                    style={{width: "29%"}}
                    value={actionArray[2]}                    
                    placeholder={actionArray[2]}
                    disabled
                /></> : <>
                    <InputMan 
                        disabled 
                        placeholder={actionArray[0]}
                        value={actionArray[0]} 
                        style={{width: "20%"}}/>

                    <InputMan
                    style={{width: "73%"}}
                /> 
                </>}

                <div 
                    style={{width: "5%", display:"flex", alignItems: "center", cursor: "pointer"}}                
                    onClick={handleRemove}>
                    <IconX />
                </div>        
            </Flex>
    )
}

const UserScriptSection = ({phase, phaseLabel, state, setState, actionArray}) => {
    const handleClick = (actionArray) => {
        const newState = {
            ...state,
            [actionArray[0]] : [ ...state[actionArray[0]] ,actionArray]                
        }
        setState(newState)
    }

    return(
    <>
        <Badge>{phase}</Badge>
        <Space h="xs"/>
        <Text size="xs">{phaseLabel}</Text>            
        

        <Space h="xs"/>
        <Divider/>             
        <Space h="md"/>   

        {state[actionArray[0]].map((el,ind) => (el == "" ? ""  : 
        <div key={ind}>
            <UserScriptRow  
                id={ind} 
                actionArray={actionArray}      
                state={state}
                setState={setState}      
            />
            <Space h="xs"/>
        </div> ))}

        
        
        <Button variant="transparent" fullWidth onClick={() => handleClick(actionArray)}>Add New Row</Button>
    </>)
}

const UserScriptForm = forwardRef((props,ref) => {
    const [userScripts, setUserScripts] = useState({
        "COPY": [],
        "ADD": [],
        "RUN": []
    })

    useImperativeHandle(ref, () => ({
        getUserScripts: () => userScripts
    }))

    return(
        <>
            <Space h="xs"/>
                    <UserScriptSection 
                        phase="Copy Phase"
                        phaseLabel="Copy files from host machine to instance ( /usr folder)"
                        state={userScripts}
                        setState={setUserScripts}
                        actionArray={["COPY", "", "/usr"]}
                    />  
                     
            <Space h="xs"/>
                    <UserScriptSection 
                        phase="Add Phase"
                        phaseLabel="Copy files from external file source to instance ( /usr folder)"
                        state={userScripts}
                        setState={setUserScripts}
                        actionArray={["ADD", "", "/usr"]}
                    />  

            <Space h="xs"/>
                    <UserScriptSection 
                        phase="Run Phase"
                        phaseLabel="Add Bootstrap Functions"
                        state={userScripts}
                        setState={setUserScripts}
                        actionArray={["RUN", ""]}
                    />               
        </>   
    )

})

export default UserScriptForm