import React, {useRef, useState, useEffect} from 'react'
import {ReactThemes, ReactTerminal} from 'react-terminal-component'
import { EmulatorState, OutputFactory, Outputs } from 'javascript-terminal'

const Term = ({states}) => {
    const termRef = useRef(null)
    const [PID, setPID] = useState(undefined)
    const [emulatorState, setEmulatorState] = useState(
        EmulatorState.create({
            outputs: Outputs.create([])
        })
    )

    const stdout = (output) => {
        setEmulatorState(prevEmulatorState => {
            const newOutput = prevEmulatorState.getOutputs().push(OutputFactory.makeTextOutput(output))        
            return prevEmulatorState.setOutputs(newOutput)
        })
    }   

    useEffect(() => {
        const spawn = async () => {
            
            window.electron.spawn(states.commands)

            window.electron.onOutput(data => stdout(data))
            window.electron.onExit(data => {
                
                stdout(" ")
                stdout("------- END OF FILE --------")
                stdout(" ")
            })            
        }
        
        setPID(spawn())
        // console.log(pid)
    }, [])

    return(
        <>
            <ReactTerminal 
                theme={ReactThemes.sea}
                emulatorState={emulatorState}
                ref={termRef}
                acceptInput={false}
            />                 
        </>
    )
}

export default Term