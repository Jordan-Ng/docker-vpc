import React, {useState, forwardRef, useImperativeHandle, useEffect} from "react"
import { TextInput as InputMan, Flex, Text, Space, Badge, Divider, Button } from "@mantine/core"
import { IconX } from "@tabler/icons-react"

const UserScriptRow = ({id, actionArray, state, setState}) => {
    const [timer, setTimer] = useState(null)

    const handleRemove = (id) => {
        // const newList = [...state[actionArray[0]]]
        // newList[id] = ""

        // setState({
        //     ...state,
        //     [actionArray[0]] : newList
        // })
        
        setState({
            ...state,
            [actionArray[0]] : state[actionArray[0]].filter((el, ind) => ind != id)
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
                    value={state[actionArray[0]][id][1]}
                    
                    onChange={e => {                    
                        
                        let newVal = [...state[actionArray[0]]]

                        newVal[id][1] = e.target.value

                        setState({
                            ...state,
                            [actionArray[0]] : newVal
                        })
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
                    value={state[actionArray[0]][id][1]}

                    onChange={e => {                    
                        
                        let newVal = [...state[actionArray[0]]]

                        newVal[id][1] = e.target.value

                        setState({
                            ...state,
                            [actionArray[0]] : newVal
                        })
                    }}
                /> 
                </>}

                <div 
                    style={{width: "5%", display:"flex", alignItems: "center", cursor: "pointer"}}                
                    // onClick={handleRemove}>
                    onClick={() => handleRemove(id)}>
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
        // "COPY": [],
        "ADD": [],
        "RUN": [
            ["RUN", "apt-get -y update && apt-get install -y git curl gnupg npm"],
            ["RUN", "cd /root && git clone https://github.com/Jordan-Ng/dummy-express.git"],
            ["RUN", "cd /root/dummy-express && npm install"],
            // ["RUN", ""],
        ]
    })

    useImperativeHandle(ref, () => ({
        getUserScripts: () => {
            Object.keys(userScripts).forEach(k => {
                userScripts[k] = userScripts[k].filter(actionArr => actionArr[1] != "")
            })
            return userScripts
        }
    }))

    useEffect(() => {
        console.log(userScripts)
    }, [userScripts])

    return(
        <>
            {/* <Space h="xs"/>
                    <UserScriptSection 
                        phase="Copy Phase"
                        phaseLabel="Copy files from host machine to instance ( /usr folder)"
                        state={userScripts}
                        setState={setUserScripts}
                        actionArray={["COPY", "", "/usr"]}
                    />   */}
                     
            <Space h="xs"/>
                    <UserScriptSection 
                        phase="Add Phase"
                        phaseLabel="Copy files from external file source to instance ( /usr folder)"
                        state={userScripts}
                        setState={setUserScripts}
                        actionArray={["ADD", "", "/home"]}
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