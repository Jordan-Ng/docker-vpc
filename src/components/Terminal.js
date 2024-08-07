import React, {useRef, useState, useEffect} from "react"
import { ReactThemes, ReactTerminal } from 'react-terminal-component';
import {EmulatorState, OutputFactory, Outputs} from "javascript-terminal"

const Terminal = ({instructions, state, setState}) => {
    const terminalRef = useRef(null)
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

        stdout(instructions[state.toString()].message)
        window.electron.spawn(instructions[state.toString()].commands)

        window.electron.onOutput(data => stdout(data))
        window.electron.onExit(data => {
            stdout(" ")
            stdout("[docker-vpc] process exited with code " + data)
            stdout(" ")
            stdout(" ")
    
            if(data == "0"){
                if (state != 3){
                    setState(state + 1)
                }
            }
            
          })        
    
          return () => {
            window.electron.onOutput(null)
            window.electron.onExit(null)
          }
        
    }, [state])


    return(
        <>
            <ReactTerminal 
                theme={ReactThemes.sea}
                emulatorState={emulatorState}
                ref={terminalRef}
                acceptInput={false}
            />        
        </>
    )
}

export default Terminal