import React, {useState} from "react"
import {Table as TableMan, Modal, Checkbox} from "@mantine/core"
import { useDisclosure } from '@mantine/hooks'

// ====== Row Component =======
const Row = ({showModal, data, modalTitle, stateMgr, rowId, Child, rowSelectable, callback}) => {
    const [isOpen, {open, close}] = useDisclosure(false)
    const [dt, setDt] = useState(null)
    
    const handleClick = async () => {        
        if (typeof callback === "function"){                                  
            const formattedData = await callback(data)                                  
            setDt(formattedData)
        }
        if (showModal) open()
    }        

    return(
        <>
            {showModal ? 
            <Modal opened={isOpen} onClose={close} title={modalTitle || ""} size="xl" >                
                { <Child data={dt} /> || ""}                 
            </Modal> : ""}

            <TableMan.Tr
                key={rowId}                
            >
                {rowSelectable ? 
                <TableMan.Td>
                    <Checkbox 
                        checked={stateMgr.state.includes(data.name)}
                        onChange={e => stateMgr.setState(e.currentTarget.checked ? [...stateMgr.state, data.name] : stateMgr.state.filter(name => name != data.name))}
                    />
                </TableMan.Td>
                : ""}
                                
                {Object.values(data).map((val, ind) => 
                <TableMan.Td 
                    key={ind} 
                    style={showModal ? {cursor: "pointer"} : ""}
                    onClick={handleClick}
                    >
                {val}
                </TableMan.Td>)}                
                
                
            </TableMan.Tr>            
        </>
    )}



// ====== Table Component =======
const Table = (
    {props: {
        showModal, 
        modalTitle, 
        callback, 
        child, 
        columns, 
        data, 
        rowSelectable, 
        selectedRows, 
        setSelectedRows
        }
    }) => {

    return(    
        <TableMan 
            stickyHeader 
            stickyHeaderOffset={60} 
            verticalSpacing="md">

        <TableMan.Thead>
                <TableMan.Tr>
                    {rowSelectable ? <TableMan.Th key="checked-column"></TableMan.Th> : ""}
                    {columns?.map((col, ind) => <TableMan.Th key={ind}>{col}</TableMan.Th>)}
                </TableMan.Tr>
            </TableMan.Thead>

            <TableMan.Tbody>            
                {data?.map((dt,ind) => <Row 
                    key={ind} 
                    showModal={showModal}
                    modalTitle={modalTitle}
                    callback={callback}
                    Child={child}
                    rowSelectable={rowSelectable || false}
                    stateMgr={{
                        state : selectedRows,
                        setState: setSelectedRows
                    }}
                    data={dt}
                    />
                        )}
            </TableMan.Tbody>        
        </TableMan>
    )}
    // )

export default Table