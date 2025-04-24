import React, {useState} from 'react'
import fx from '../../fx'

const useLBDashboard = () => {
    const [lbData, setLbData] = useState([])
    const [message, setMessage] = useState("")
    const [isVisible, setIsVisible] = useState(true)

    const get_lb_cluster_information = async() => {
        const data = await fx.ec2.list_lb_cluster_info()
        await setLbData(data)        
    }

    const ssh_instance = async(vi_name) => {
        setIsVisible(false)

        await fx.ec2.ssh_instance(
            vi_name,
            message => setMessage(message),
            () => (setMessage(""), setIsVisible(true))
        )
    }

    const start_lb_cluster = async(lb_cluster, composefFile) => {
        const isSuccessful = await fx.ec2.start_lb_cluster(composefFile)
        if (isSuccessful) {
            fx.base.notify(`${lb_cluster} started successfully!`)
            await get_lb_cluster_information()            
            return
        }
        fx.base.notify(`Failed to start ${lb_cluster}`, 'error')
    }    

    const stop_lb_cluster = async(lb_cluster, composefFile) => {
        fx.base.notify(`Hang tight, stopping ${lb_cluster}`, 'working', 2000)
        const isSuccessful = await fx.ec2.stop_lb_cluster(composefFile)
        if (isSuccessful) {
            fx.base.clear_notifications()
            fx.base.notify(`${lb_cluster} stopped successfully!`)            
            await get_lb_cluster_information()
            return
        }
        fx.base.notify(`Failed to stop ${lb_cluster}`, 'error')
    }

    const delete_lb_clusters = async(lb_clusters) => {
        fx.base.notify(`Hang tight, deleting load balancers`, 'working', 3000)
        let is_successful = true

        for (const lb of lb_clusters){
            const filePath = await window.electron.pathJoin(["compose_files", lb, "docker-compose.yml"])
            const exitObj = await fx.base.exec(`docker compose -f ${filePath} down && rm -rf ./compose_files/${lb}`)
            if (exitObj.exitStatus == 0) {
                fx.base.notify(`Deleted lb cluster ${lb}`)
                continue
            }
            
            is_successful = false
            fx.base.notify(`Could not delete ${lb}`, 'error')
        }        

        if (is_successful){
            fx.base.clear_notifications()
            fx.base.notify('Deleted lb cluster(s) successfully!')
            get_lb_cluster_information()
        }
        else {
            fx.base.notify('One of more lb cluster(s) could not be deleted', 'info')
        }
    }


    return {lbData, message, isVisible, get_lb_cluster_information, start_lb_cluster, stop_lb_cluster, delete_lb_clusters, ssh_instance}
}

export default useLBDashboard