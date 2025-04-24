import React, {useState, useEffect} from 'react'
import fx from '../../fx'
import { Button } from '../../../components'

const useAPIGWDashboard_hooks = () => {
    const [gateways, setGateways] = useState(undefined)
    
    const getGateways = async() => {
        setGateways(await fx.api.list_gateway_clusters())        
    }

    const startGateway = async(gateway) => {
        fx.base.notify(`Hang tight, starting ${gateway}`, 'working', 2000)
        const exitObj = await fx.base.exec(`docker compose -p ${gateway} start`)
        if (exitObj.exitStatus == 0){
            fx.base.notify(`${gateway} started successfully!`)
            return getGateways()
        }
        fx.base.notify(`Unable to Start ${gateway}`, "error")
    }

    const stopGateway = async(gateway) => {
        fx.base.notify(`Hang tight, stopping ${gateway}`, 'working', 20000)
        const exitObj = await fx.base.exec(`docker compose -p ${gateway} stop`)
        if (exitObj.exitStatus == 0){
            fx.base.clear_notifications()
            fx.base.notify(`${gateway} stopped successfully!`)
            return getGateways()
        }
        fx.base.notify(`Unable to Stop ${gateway}`, "error")
    }

    const deleteGateways = async(gateways) => {
        fx.base.notify("Hang tight, working .. ", "working", 3000)
        for (const gw of gateways){
            const absComposeFilePath = await window.electron.pathJoin(["gw_compose_files", gw ,"docker-compose.yml"])

            const exitObj = await fx.base.exec(`docker compose -f ${absComposeFilePath} down`)
            if (exitObj.exitStatus == 0) {
                const result = await fx.base.exec(`rm -rd ./gw_compose_files/${gw}`)
                if (result.exitStatus == 0) fx.base.notify(`Removed ${gw} Successfully!`); continue;                
            }
            fx.base.notify(`Unable to remove ${gw}`, "error")
        }
        return getGateways()
    }


    return {getGateways, gateways, startGateway, stopGateway, deleteGateways}
}

export default useAPIGWDashboard_hooks
