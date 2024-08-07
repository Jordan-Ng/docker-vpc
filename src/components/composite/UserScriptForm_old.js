import React, {useState, forwardRef, useImperativeHandle} from "react"
import { TextInput as InputMan, Group, Select, Flex, Text, Space, Stack, Badge, Divider, Button } from "@mantine/core"
import { IconX } from "@tabler/icons-react"

const UserScriptForm = forwardRef((props, ref) => {
    const [input, setInput] = useState("")
    const [userScripts, setUserScripts] = useState({
        "COPY": [],
        "ADD": [],
        "RUN": []
    })

    const [mock, setMock] = useState({
        "COPY": [],
        "ADD": [],
        "RUN": []
    })
    

    const UserScriptRow = ({id, actionArray, stateObj}) => {
        // const [input, setInput] = useState("")

        const handleRemove = () => {
            const newList = [...stateObj.state[actionArray[0]]]
            newList[id] = ""        
            
            stateObj.setState({
                ...stateObj.state,
                [actionArray[0]] : newList
            })             
        }
            
        return (
            <Flex justify="space-between">            
                {actionArray[0] != "RUN" ? <><InputMan 
                    disabled 
                    placeholder={actionArray[0]}
                    value={actionArray[0]} 
                    style={{width: "20%"}}/>

                <InputMan
                    style={{width: "39%"}}
                    // value={stateObj.state[actionArray[0]][id][1]}                    
                    // value={userScripts[actionArray[0]][id][1]}
                    key={id}
                    onChange={e => {   
                        // setInput(e.target.value)  
                        console.log(e.target.value)
                        
                        // const newScriptArray = userScripts[actionArray[0]]
                        // newScriptArray[id][1] = e.target.value
                        
                        // setUserScripts({
                        //     ...userScripts,
                        //     [actionArray[0]] : newScriptArray
                        // })
                        // const newValue = stateObj.state[actionArray[0]]
                        
                        // newValue[id][1] = e.target.value                        
                        // stateObj.setState({
                        //     ...stateObj.state,
                        //     [actionArray[0]] : newValue
                        // })                        
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
                // onClick={() => console.log(userScripts)}
                onClick={() => console.log(mock)}
                >
                    <IconX />
                </div>        
            </Flex>)
    }

    const UserScriptSection = ({phase, phaseLabel, state, setState, actionArray}) => {

        const handleClick = ( actionArray) => {        
            
            const newState= {
                // ...state,
                ...userScripts,
                // [actionArray[0]] : [ ...state[actionArray[0]] ,actionArray]                
                [actionArray[0]] : [ ...userScripts[actionArray[0]] ,actionArray]                
            }            
            // setState(newState)
            setUserScripts(newState)
        }

        return(
            <>
                <Badge>{phase}</Badge>
                <Space h="xs"/>
                <Text size="xs">{phaseLabel}</Text>            
                

                <Space h="xs"/>
                <Divider/>             
                <Space h="md"/>   

                {userScripts[actionArray[0]].map((el,ind) => (el == "" ? ""  : 
                <div key={ind}>
                    <UserScriptRow  
                    id={ind} 
                    actionArray={actionArray}
                    // stateObj={{
                    //     state: state,
                    //     setState: setState
                    // }}
                    />
                    <Space h="xs"/>
                </div> ))}

                
                
                <Button variant="transparent" fullWidth onClick={() => handleClick(actionArray)}>Add New Row</Button>
            </>
        )
    }    

    return(
        <>
            
                <Space h="xs"/>
                <UserScriptSection 
                    phase="Copy Phase"
                    phaseLabel="Copy files from host machine to instance ( /usr folder)"
                    // state={stateStore}
                    // setState={stateStoreMgr}
                    actionArray={["COPY", "", "/usr"]}
                />                

                {/* <Space h="lg"/>

                <UserScriptSection 
                    phase="Add Phase"
                    phaseLabel="Copy files from external file source to instance ( /usr folder)"
                    state={stateStore}
                    setState={stateStoreMgr}
                    actionArray={["ADD", "", "/usr"]}
                /> 
                
                <Space h="lg"/>

                <UserScriptSection 
                    phase="Run Phase"
                    phaseLabel="Add Bootstrap functions"
                    state={stateStore}
                    setState={stateStoreMgr}
                    actionArray={["RUN", ""]}
                />                              */}
        </>
    )
})

export default UserScriptForm