import React, {useEffect} from 'react'
import useVolumes from '../../helpers/hooks/EC2/useVolumes'
import { Badge, Box, Container, Flex, Space } from '@mantine/core'
import { Button, DeleteConfirmationModal, Table } from '../../components'
import { IconTrash } from '@tabler/icons-react'

const AttachmentModal = ({data}) => {    
    
    return(<>
        <Badge>{data?.volName}</Badge>        
        <Table 
            props={{
                columns: ["Container Name", "Status"],
                data: data?.data
            }}
        /> 
    </>)
}

const Volumes = () => {
    const {volumes, getVolumes, getVolumeAttachments} = useVolumes()

    useEffect(() => {
        getVolumes()
    }, [])

    return(
        <Container>
            <Box>
                {<Table 
                    props={{
                        columns: ["Name", "Driver", "Size", "Attachments", "Mountpoint"],
                        data: volumes,
                        rowSelectable: true,
                        rowAttributeSelect: "name",
                        modal: {
                            title: "Attachment Details",
                            child: AttachmentModal,                            
                            onOpen: getVolumeAttachments
                        },
                        taskbar: {
                            props: {
                                Right: ({selectedRows, setSelectedRows}) => (
                                    <Flex>
                                        <Button 
                                            variant="modal"                                            
                                            props={{
                                                child: DeleteConfirmationModal,
                                                childState: {
                                                    state: selectedRows
                                                },
                                                button: {
                                                    text: "Delete Volume(s)",
                                                    color: "red",
                                                    rightSection: <IconTrash stroke={1.5}/>,
                                                    disabled: selectedRows?.length == 0
                                                }
                                            }}
                                        />
                                    </Flex>
                                )
                            }
                        }
                    }}
                /> }
            </Box> 
        </Container>
    )
}

export default Volumes

