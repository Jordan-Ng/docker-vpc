import React, {useState, useEffect} from 'react'
import {Table as TableMan, Modal, Card, Text, Badge, Checkbox, Paper} from "@mantine/core"
import { useDisclosure } from '@mantine/hooks'

const Row = ({props}) => {
    const [isOpen, {open, close}] = useDisclosure(false)
    const [data, setData] = useState(null)

    const handleClick = async (props) => {
        
        if (typeof props?.callback === "function"){            
            const formattedData = await props?.callback(props)            
            setData(formattedData)
        }
        if (props?.showModal) open()
    }

    return (
        <>
            {props?.showModal ? 
            <Modal opened={isOpen} onClose={close} title={props?.modalTitle || ""} size="xl" >
                {props?.child ? <props.child data={data} /> : ""}
            </Modal> : ""}

            <TableMan.Tr
                key={props?.rowId}                
            >
                {props?.rowChecked ? 
                <TableMan.Td>
                    <Checkbox 
                        checked={props?.selectedRows?.includes(props.data.name)}
                        onChange={e => props?.setSelectedRows(e.currentTarget.checked ? [...props?.selectedRows, props.data.name] : props?.selectedRows.filter(name => name != props.data.name))}
                    />
                </TableMan.Td>
                : ""}
                                
                {Object.values(props?.data).map((val, ind) => 
                <TableMan.Td 
                    key={ind} 
                    style={props?.showModal ? {cursor: "pointer"} : ""}
                    onClick={() => handleClick(props)}>
                {val}
                </TableMan.Td>)}                
                
                
            </TableMan.Tr>            
        </>
    )
}


const Table = ({props}) => {

    return (<TableMan stickyHeader stickyHeaderOffset={60} verticalSpacing="md">
        <TableMan.Thead>
            <TableMan.Tr>
                {props?.rowChecked ? <TableMan.Th key="checked-column"></TableMan.Th> : ""}
                {props?.columns.map((col, ind) => <TableMan.Th key={ind}>{col}</TableMan.Th>)}
            </TableMan.Tr>
        </TableMan.Thead>

        <TableMan.Tbody>            
            {props?.data.map((dt,ind) => <Row key={ind} props={{
                ...props,
                data: dt,                
                }}/>)}
        </TableMan.Tbody>        
    </TableMan>)
}

export default Table