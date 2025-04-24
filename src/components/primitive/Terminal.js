import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react'
import {ReactTerminal, ReactThemes} from 'react-terminal-component-new'
import {EmulatorState, OutputFactory, Outputs} from "javascript-terminal";

// const Terminal = ({props}) => {
const Terminal = forwardRef(({props, checkpoint, setCheckpoint, jobs}, ref) => {
    
    const [pid, setpid] = useState(undefined)
    const [emulatorState, setEmulatorState] = useState(
        EmulatorState.create({
            outputs: Outputs.create([]),            
        })
    )

    useImperativeHandle(ref, () => ({
        getPid: () => pid        
    }))

    const stdout = (output) => {
         setEmulatorState( prevEmulatorState => {
            const newOutput = prevEmulatorState.getOutputs().push(OutputFactory.makeTextOutput(output))
            return prevEmulatorState.setOutputs(newOutput)
        })
    }

    const handleCheckpoints = async () => {
        // multiple jobs
        if (checkpoint != undefined) {
            if (checkpoint != jobs.length) {

                stdout(jobs[checkpoint].message)
                stdout(" ")

                const jobType = jobs[checkpoint].type || "shell"
                
                // == fx type==
                if (jobType == "fx"){
                    const exitStatus = await jobs[checkpoint].job(stdout)

                    stdout(" ")
                    stdout("[docker-vpc] fx process exited with code " + exitStatus)
                    stdout("________________________________________________________________")
                    stdout(" ")
                    stdout(" ")

                    if (exitStatus == 0){
                        if (checkpoint != jobs.length) {
                            setCheckpoint(checkpoint+1)
                        }
                    }
                }                

                // == shell type ==
                else {
                    window.electron.spawn(jobs[checkpoint].commands)
                    window.electron.onOutput(msg => stdout(msg))
                    window.electron.onError(err => stdout(err))
                    window.electron.onExit(data => {
                        stdout(" ")
                        stdout("[docker-vpc] shell process exited with code " + data)
                        stdout("________________________________________________________________")
                        stdout(" ")
                        stdout(" ")
        
                        if(data == "0"){
                            if (checkpoint != jobs.length){
                                setCheckpoint(checkpoint + 1)
                            }
                        }
                    })                    
                }
            }
        }

        // single job
        else {
            props?.job(props?.args, {
                onSpawn: setpid,
                onOutput: stdout,
                onExit: () => stdout("========== END OF FILE ===========")
            })
        }
    }

    useEffect(() => {
        handleCheckpoints()

        return () => {
            window.electron.onOutput(null)
            window.electron.onError(null)
            window.electron.onExit(null)
        }



        // if (checkpoint !== undefined) {
        //     if (checkpoint != jobs.length){
        //         const jobType = jobs[checkpoint].type || "shell"

        //         if (jobType == "fx"){
        //             stdout(jobs[checkpoint].message)
                    
        //             jobs[checkpoint].job(stdout).then(
        //                 exitStatus => {
        //                     stdout(" ")
        //                     stdout("[docker-vpc] process exited with code " + exitStatus)
        //                     stdout("________________________________________________________________")
        //                     stdout(" ")
        //                     stdout(" ")

        //                     if (exitStatus == 0) {
        //                         if (checkpoint != jobs.length){
        //                             setCheckpoint(checkpoint + 1)
        //                             // return
        //                         }
        //                     }
        //                 }
        //             )

        //             return () => {
        //                 window.electron.onOutput(null)
        //                 window.electron.onError(null)
        //                 window.electron.onExit(null)
        //             }
        //         }
        //         // else {
        //         // ==============
        //         stdout(jobs[checkpoint].message)
        //         stdout(" ")
    
        //         window.electron.spawn(jobs[checkpoint].commands)
        //         window.electron.onOutput(msg => stdout(msg))
        //         window.electron.onError(err => stdout(err))
        //         window.electron.onExit(data => {
        //             stdout(" ")
        //             stdout("[docker-vpc] process exited with code " + data)
        //             stdout("________________________________________________________________")
        //             stdout(" ")
        //             stdout(" ")
    
        //             if(data == "0"){
        //                 if (checkpoint != jobs.length){
        //                     setCheckpoint(checkpoint + 1)
        //                 }
        //             }
        //         })
        //         // }

        //         return () => {
        //             window.electron.onOutput(null)
        //             window.electron.onError(null)
        //             window.electron.onExit(null)
        //         }
        //         //  ==================

        //     }
        // }
        // else {            
        //     props?.job(props?.args, {
        //         onSpawn: setpid,
        //         onOutput: stdout,
        //         onExit: () => stdout("========== END OF FILE ===========")
        //     })
        // }
    }, [checkpoint])

    return(        
            <ReactTerminal 
                theme={{...ReactThemes.sea, height: props?.height || "600px"}}
                emulatorState={emulatorState}
                acceptInput={false}                
            />                    
    )
})

export default Terminal