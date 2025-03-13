import React, {useState, useEffect} from "react"
import fx from "../../fx"

const useEC2LBDashboard_hooks = () => {
    const [lbData, setLbData] = useState(undefined)
    const [message, setMessage] = useState("")
    const [isVisible, setIsVisible] = useState(true)

    const get_lb_cluster_information = async () => {
        const data = await fx.ec2.list_lb_cluster_info()
        setLbData(data)
    }

    const stop_cluster = async (composeFilePath, lbName) => {
        fx.base.notify(true, {
            message: `Working, please hold on`
        })
        fx.ec2.stop_lb_cluster(composeFilePath).then(exitObj => {
            if (exitObj.exitStatus == 0){
                fx.base.notify(true, {
                    message: `${lbName} stopped successfully`
                })
                get_lb_cluster_information()
            }
        })
    }

    const start_cluster = async (composeFilePath, lbName) => {
        fx.base.notify(true, {
            message: `Working, please hold on`
        })
        fx.ec2.start_lb_cluster(composeFilePath).then(exitObj => {
            if (exitObj.exitStatus == 0){
                fx.base.notify(true, {
                    message: `${lbName} started successfully`
                })
                get_lb_cluster_information()
            }
        })
    }

    const delete_clusters = async (targetLbs) => {
        fx.base.notify(true, {
            message: 'Working, please hold on'
        })

        for (const targetlb of targetLbs) {
            const exitObj = await fx.base.exec(`docker compose -f ${targetlb.file} down && rm -rf ./compose_files/${targetlb.name}`);
            if (exitObj.exitStatus === 0) {
                fx.base.notify(true, {
                    message: `${targetlb.name} removed successfully`
                });
            }
        }

        get_lb_cluster_information()        
    }

    const ssh_instance = (instanceName) => {

        setIsVisible(false)

        fx.ec2.ssh_instance(
            [instanceName],
            data => setMessage(data),
            () => (setMessage(""), setIsVisible(true))
        )
    }

    return {lbData, get_lb_cluster_information, stop_cluster, start_cluster, ssh_instance, isVisible, message, delete_clusters}
}

export default useEC2LBDashboard_hooks