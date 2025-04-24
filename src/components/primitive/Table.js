import React, {useState, forwardRef, useImperativeHandle, useEffect} from 'react'
import {Table as TableMan, Modal, Checkbox, Space, Group} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

const TaskBar = ({props, selectedRows, setSelectedRows}) => {
    const Left = props?.Left 
    const Right = props?.Right     
    
    return(
    <Group justify="space-between">        
        {props.Left ? <Left selectedRows={selectedRows} setSelectedRows={setSelectedRows}/> : <Space w="xs"/>}
        {props.Right ? <Right selectedRows={selectedRows} setSelectedRows={setSelectedRows}/> : <Space w="xs"/>}
    </Group>)
}

const Row = ({props}) => {        
    const [isOpen, {open, close}] = useDisclosure(false)
    const [modalChildData, setModalChildData] = useState(null)
    const Child = props?.modal?.child
    const handleModalOpen = async() => {
        if (props?.modal.onOpen && typeof props.modal.onOpen === "function"){
            await setModalChildData(await props.modal.onOpen(props.dt))
        }
        if (props?.modal) open()
    }

    const handleModalClose = async() => {
        setModalChildData(null)
        if (props?.modal.onClose && typeof props.modal.OnClose === "function"){
            await props.modal.onClose()
        }
        if (props?.modal) close()
    }
    

    return(<>
        {props?.modal &&
            <Modal opened={isOpen} onClose={handleModalClose} title={props?.modal.title || ""} size={props?.modal?.size || "xl"} >                                
                {typeof Child === "string" ?  <Child data={props?.modalChildData} /> : Child({data: modalChildData, addHandlers: props?.modal.addHandlers})}
            </Modal>}

        <TableMan.Tr>
            {props?.rowSelectable && 
            <TableMan.Td>
                <Checkbox 
                    checked={props?.selectedRows.length > 0 && props?.selectedRows.includes(props.dt[props?.rowAttributeSelect])}
                    onChange={props?.onCheck}
                />
            </TableMan.Td>}
            
            {Object.keys(props?.dt).map((key,ind) => (
                <TableMan.Td
                    key={ind}
                    style={{
                        cursor: props?.modal ? "pointer" : "default",
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow : "ellipsis",
                        whiteSpace: "nowrap"
                    }}
                    onClick={props?.modal ? 
                        props?.disableColumnSelectOn?.includes(key) ? () => {} : handleModalOpen
                        : () => {}}
                >
                    {props.dt[key]}
                </TableMan.Td>
            ))}
        </TableMan.Tr>
    </>)
}

const Table = ({props}) => {
// const Table = forwardRef(({props}, ref) => {    
    const [selectedRows, setSelectedRows] = useState([])    
    
    // useImperativeHandle(ref, () => ({
    //     getSelectedRows: () => selectedRows,              
    // }))

    return(
        <>
        {props?.taskbar && <TaskBar 
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            props={{                
                ...props.taskbar.props
            }}
        />}
         {/* <TaskBar 
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            props={{                
                ...props?.taskbar?.props
            }}
        /> */}
        <Space h="sm" />
        <TableMan 
            stickyHeader 
            stickyHeaderOffset={60} 
            verticalSpacing="md">
        
            <TableMan.Thead>
                <TableMan.Tr>
                    {props?.rowSelectable ? <TableMan.Th key="checked-column"></TableMan.Th> : ""}
                    {props?.columns?.map((col, ind) => <TableMan.Th key={ind}>{col}</TableMan.Th>)}
                </TableMan.Tr>
            </TableMan.Thead>

            <TableMan.Tbody>            
                {props?.data && props.data.length > 0 ? props.data.map((dt,ind) => <Row 
                    key={ind}
                    props={{
                        selectedRows,
                        rowAttributeSelect: props?.rowAttributeSelect,
                        disableColumnSelectOn: props?.disableColumnSelectOn,                        
                        rowSelectable: props?.rowSelectable,
                        ...(props?.modal ? {modal : props?.modal} : {}),
                        dt,
                        onCheck: async () => {
                            
                            if (selectedRows.includes(dt[props?.rowAttributeSelect])){
                                await setSelectedRows(selectedRows.filter(row => row != dt[props?.rowAttributeSelect]))                                
                                if (props?.onUnselect && typeof props.onUnselect === "function") await props.onUnselect()
                            }
                            else{                            
                                await setSelectedRows([...selectedRows, dt[props?.rowAttributeSelect]])                                
                                if (props?.onSelect && typeof props.onSelect === "function") await props.onSelect()
                            }
                        }
                    }}
                />) : <TableMan.Tr><TableMan.Td colSpan={props?.rowSelectable ? props?.columns?.length +1 : props?.columns?.length} style={{textAlign: "center"}}>No Information</TableMan.Td></TableMan.Tr>}
            </TableMan.Tbody>

        </TableMan>        
        </>
    )
}
// })

export default Table