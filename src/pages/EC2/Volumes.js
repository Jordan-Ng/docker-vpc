import React, {useState, useEffect} from "react"
import {Button, Container, Loader, TextInput, Badge, Table as TableMan} from "@mantine/core"
import {Table, ActionIcon, Modal, DeleteConfirmationModal} from "../../components"
import {IconRefresh, IconPlus, IconTrash} from "@tabler/icons-react"
import fx from "../../helpers/fx"


const CreateVolumeForm = ({close, onClickHandler}) => {

    const [volName, setVolName] = useState("")

    const handleSubmit = async () => {                
        onClickHandler(volName)
        close()
    }

    return(        
        <> 
            <TextInput
                label="Name"
                description="desired name for new volume"
                style={{
                    marginBottom: "20px"
                }}
                onChange={e => {                    
                    setVolName(e.target.value)
                }}
                
                error={volName.length == 1 ? "Please enter a volume name with more than 1 character" : ""}
            />
            <Button disabled={volName.length <= 1} color="green" fullWidth onClick={handleSubmit}>Create</Button>
        </>        
    )
}

const AttachmentModal = ({data}) => {    
    
    return (
        <>
            <Badge>{data.volName}</Badge>

            <TableMan style={{marginTop: "10px"}}>
                    <TableMan.Thead>
                        <TableMan.Tr>                                                        
                            {data.columns ? 
                            data.columns.map((col, ind) => <TableMan.Th key={ind}>{col}</TableMan.Th>) 
                            : 
                            <>
                                <TableMan.Th>Container Name</TableMan.Th>
                                <TableMan.Th>Status</TableMan.Th>
                            </>}
                        </TableMan.Tr>
                    </TableMan.Thead>

                    <TableMan.Tbody>
                        {data.data.length > 0 ? data.data.map((val, ind) => (
                            <TableMan.Tr key={ind}>
                                {Object.values(val).map((dt, ind) => <TableMan.Td key={ind}>{dt}</TableMan.Td>)}
                            </TableMan.Tr>
                        )) : <TableMan.Tr><TableMan.Td colSpan={2} style={{textAlign: "center"}}>No Information</TableMan.Td></TableMan.Tr>}
                        
                    </TableMan.Tbody>
                </TableMan>
        </>
    )
}


const Volumes = () => {
    const [volumes, setVolumes] = useState(null)
    const [selectedRows, setSelectedRows] = useState([])

    const getVolumes = async () => {        
        const data = await fx.volume.list()        
        setVolumes(JSON.parse(data))
    }

    const getVolumeAttachments = async (dataObj) => {        
        
        const data = JSON.parse( await fx.volume.list_attachments(dataObj.name) )
        
        return {
            volName : dataObj.name,
            data : data,
            columns : data.length > 0 ? Object.keys(data[0]) : null
        }        
    }

    useEffect(() => {
        getVolumes()
    }, [])

    return (
        <Container data-testid="ec2-volumes">
            <div style={{marginBottom: "20px", display: "flex", justifyContent: "end"}}>
                <ActionIcon 
                    props = {{
                        color: "cyan",
                        callback : getVolumes,                        
                        icon: IconRefresh ,
                        iconStyle: {
                            width: '60%',
                            height: '60%'
                        },
                        onClick: getVolumes
                    }}
                />
                <Modal 
                    props = {{                        
                        child: DeleteConfirmationModal,
                        childState: {
                            state : selectedRows,
                            setState : setSelectedRows
                        },
                        onClickHandler : async () => {
                            const responseObj = await fx.volume.delete(selectedRows)
                            
                            if (responseObj.exitStatus == 0){
                                setSelectedRows([])

                                fx.base.notify(true, {
                                    title: "Great Success!",
                                    message: "Volume(s) deleted successfully"
                                })
                            }
                            
                            else {
                                fx.base.notify(false, {
                                    title: "Sum Ting Wong",
                                    message: "Oh oh .. we're in trouble .."
                                })
                            }

                            getVolumes()
                        },
                        color: "red",
                        rightIcon : <IconTrash />,
                        buttonText : "Delete Volume(s)",
                        buttonDisabled : selectedRows?.length == 0  
                    }}
                />
                <Modal 
                    props = {{
                        child : CreateVolumeForm,
                        onClickHandler : async (volName) => {

                            const responseObj = await fx.volume.create(volName)
                            if (responseObj.exitStatus == 0){
                                fx.base.notify({
                                    title: "Great Success!",
                                    message: "Volume created successfully!"
                                })
                            }

                            else {
                                fx.base.notify({
                                    title: "Sum Ting Wong",
                                    message: "Oh oh .. we're in trouble .."
                                })
                            }
                            getVolumes()
                        },
                        rightIcon : <IconPlus />,
                        buttonText : "Create Volume",
                        buttonStyle : {
                            marginLeft: "5px"
                        },
                        showCloseButton: false                        
                    }}
                />
            </div>
            
            {volumes ? <Table props={{
                showModal : true,
                columns : volumes?.length > 0 ? Object.keys(volumes[0]) : "",
                child : AttachmentModal,
                modalTitle : "Attachment Details",
                callback : getVolumeAttachments,
                rowSelectable : true,
                selectedRows: selectedRows,
                setSelectedRows : setSelectedRows,
                data : volumes                
                }} 
                                
                /> 
            : <Loader color="blue" style={{position: "absolute", left: "50%", top: "25%"}}/>}            
            
        </Container>
    )
}

export default Volumes