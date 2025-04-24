import React, {useState, useEffect} from 'react'
import fx from '../../fx'

const useVolumes = () => {
    const [volumes, setVolumes] = useState([])
    
    const getVolumes = async() => {
        const data = await fx.ec2.list_volumes()
        
        if(data) setVolumes(JSON.parse(data))
    }

    const getVolumeAttachments = async (dataObj) => {        
        const data = JSON.parse(await fx.ec2.list_volume_attachments(dataObj.name))
        
        return {
            volName: dataObj.name,
            data,
            columns : data.length > 0 ? Object.keys(data[0]) : null
        }
    }

    return {volumes, getVolumes, getVolumeAttachments}
}

export default useVolumes