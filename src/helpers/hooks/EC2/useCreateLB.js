import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import fx from "../../fx"


const useEC2CreateLB_hooks = () => {
    const [lb_summary, setLb_summary] = useState({
        name: undefined,
        behind_reverse_proxy : false,
        machine_image: undefined,
        port: undefined,
        no_of_replicas: 0
    })
    const [images, setImages] = useState([])
    const navigate = useNavigate()

    const onChange = (field, value) => {
        setLb_summary({
           ...lb_summary,
           [field] : value 
        })
    }

    const populateMachineImages = () => {
        fx.ec2.list_os_images().then(raw_output => {            
            const os_images = JSON.parse(raw_output).filter(imageObj => imageObj.labels?.container_type && imageObj.labels.container_type === "vm_instance").map(imageObj => imageObj.labels.name)            
            return os_images
        }).then(os_image => setImages(os_image))
    }

    const handleSubmit = () => {
        // validations here
        navigate('/load-balancer/create/new', {state: {
            data: {
                ...lb_summary,
                name: "lb-" + lb_summary.name
            }
        }})
    }
  

    return {
        lb_summary,
        setLb_summary,
        images,
        onChange,
        populateMachineImages,
        handleSubmit
    }
}

export default useEC2CreateLB_hooks