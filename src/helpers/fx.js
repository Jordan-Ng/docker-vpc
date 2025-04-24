import commands from "../helpers/commands"
import {notifications} from "@mantine/notifications"

const fx = {
    base: {
        exec : async (command) => {               
            return await window.electron.exec(command)
        },        
        
        kill : async (pid) => {
            return await window.electron.kill(pid)
        },

        cat_file: async(filePath) => {
            const exitObj = await fx.base.exec(`cat ${filePath}`)
            if (exitObj.exitStatus == 0) return exitObj.out
            console.error(exitObj)
        },
        
        clear_notifications: () => {
            notifications.clean()
        },

        notify: (message, logLevel, closeDelay=1000) => {
            switch(logLevel){
                case 'error':
                    notifications.show({
                                title: "Oh No, Sum Ting Wong",
                                message,
                                position: "top-right",
                                autoClose: closeDelay,
                                color: "red"
                            })
                    break;
                case "info":
                    notifications.show({
                        title: "Info",
                        message,
                        position: "top-right",
                        autoClose: closeDelay,                        
                        color: "yellow"
                    })
                    break;
                case "working":
                    notifications.show({
                        title: "Working ..",
                        message,
                        position: "top-right",
                        autoClose: closeDelay,
                        loading: true,
                        color: "orange"
                    })
                    break;
                default:
                    notifications.show({
                        title: "Great Success!",
                        message,
                        position: "top-right",
                        autoClose: closeDelay
                    })
                    break;
            }
        }
    },

    ec2: {
        //  ========================= EC2 Dashboard =============================
        list_instances: async () => {
            const exitObj = await fx.base.exec(commands["ec2:list_instances"].command)
            
            if (exitObj.exitStatus == 0) return exitObj.out
            console.error(exitOj)
        },

        start_instance: async(target) => {
            const exitObj = await fx.base.exec(commands["ec2:start_instance:fx"].command(target))
            if (exitObj.exitStatus == 0) return true
            return false
        },

        stop_instance: async(target) => {
            const exitObj = await fx.base.exec(commands["ec2:stop_instance:fx"].command(target))
            if (exitObj.exitStatus == 0) return true
            return false
        },

        ssh_instance: async(targetCont, onStdout, onExit) => {
            const absPath = await window.electron.pathJoin(["bin", "instance_ssh.sh"])
            window.electron.spawn({
                command: absPath,
                args: [targetCont]
            })

            window.electron.onOutput(onStdout)            
            window.electron.onExit(() => {
                onExit()
                window.electron.onSpawn(null) 
                window.electron.onOutput(null)
                window.electron.onExit(null)
            })
        },

        delete_instances: async(containers) => {
            const exitObj = await fx.base.exec(commands["ec2:delete_instances:fx"].command(containers))
            if (exitObj.exitStatus == 0) return true
            return false
        },
        //  ========================= Create Instance =============================
        list_networks: () => {
            return fx.base.exec(commands["ec2:list_networks"].command)
            .then(data => data.out)
            .catch(err => console.log("list_networkk", err))
        },

        list_ports_in_use: () => {
            return fx.base.exec(commands["ec2:list_ports_in_use"].command)
            .then(exitObj => {if (exitObj.exitStatus == 0) return exitObj.out})
            .then(stdout => stdout)
            .catch(err => console.log(err))
        },

        is_valid_instance_name: async (volName) => {            
            const result = await fx.base.exec(commands["ec2:get_container_information:fx"].command(volName))            
            return result.exitStatus != 0
        },

        //  ========================= Volumes =============================
        list_volumes: async() => {
            const exitObj = await fx.base.exec(commands["ec2:list_volumes_format_short"].command)
            if (exitObj.exitStatus == 0) return exitObj.out
            console.error(exitObj)
        },

        list_volume_attachments: async (volname) => {
            const exitObj = await fx.base.exec(commands["ec2:list_volume_attachments:fx"].command(volname))            
            if (exitObj.exitStatus == 0) return exitObj.out            
        },
        //  ========================= LB Dashboard =============================
        list_lb_cluster_info: async() => {
            try {
                const exitObj = await fx.base.exec(commands["ec2:list_lb_cluster_info"].command)
                
                if (exitObj.exitStatus == 0) {
                    let cluster_info = JSON.parse(exitObj.out)
                    
                    for (let ind =0; ind < cluster_info.length; ind++){
                        cluster_info[ind].status = cluster_info[ind].status.at(-1) == ')' ? cluster_info[ind].status.substr(0, cluster_info[ind].status.length - 3) : cluster_info[ind].status

                        const cluster_details = await fx.base.exec(commands["ec2:list_lb_cluster_components:fx"].command(cluster_info[ind].name))
                        if (cluster_details.exitStatus == 0) {
                            
                            const raw = JSON.parse(cluster_details.out)

                            cluster_info[ind].components = raw.map(dt => {
                                if (dt.labels.container_type != "vm_instance"){
                                    cluster_info[ind].network = dt.network
                                }
                                return {
                                    name: dt.name.substring(1),
                                    network: dt.network,
                                    state: dt.state,
                                    machine_image: dt.machine_image,
                                    type: dt.labels.container_type == "vm_instance" ? dt.labels.container_type : 'load balancer',
                                    application_port: dt.labels.container_type == "vm_instance" ? dt.labels[`traefik.http.services.${dt.machine_image}.loadbalancer.server.port`] : "80"
                                }
                            })
                        }
                        else {
                            cluster_info[ind].components= []
                        }
                    }
                    
                    
                    return cluster_info
                }
            }

            catch(err) {
                console.error(err)
            }
        },

        start_lb_cluster: async(composeFile) => {
            const exitObj = await fx.base.exec(commands["ec2:start_lb_cluster:fx"].command(composeFile))
            if (exitObj.exitStatus == 0) return true
            return false
        },

        stop_lb_cluster: async(composeFile) => {
            const exitObj = await fx.base.exec(commands["ec2:stop_lb_cluster:fx"].command(composeFile))
            if (exitObj.exitStatus == 0) return true
            return false
        },
        
        show_lb_logs: async(composeFile, handlers) => {
            window.electron.spawn({
                command: 'docker',
                args: ["compose", "-f", composeFile, "logs", "-f"]
            })

            window.electron.onSpawn(handlers.onSpawn)
            window.electron.onOutput(handlers.onOutput)
            window.electron.onExit(() => {
                handlers.onExit()
                window.electron.onSpawn(null)
                window.electron.onOutput(null)
                window.electron.onExit(null)            
            })
        },

        show_vi_logs: async(vi_name, handlers) => {
            window.electron.spawn({
                command: "docker",
                args: ["logs", vi_name, "-f"]
            })

            window.electron.onSpawn(handlers.onSpawn)
            window.electron.onOutput(handlers.onOutput)
            window.electron.onExit(handlers.onExit)
        },
        //  ========================= Create LB =============================
        list_created_machine_images: async() => {
            const exitObj = await fx.base.exec(commands["ec2:list_created_machine_images"].command)
            if (exitObj.exitStatus == 0) return exitObj.out
            console.error(exitObj)
        },

    },

    api : {
        // ========================= Create HTTP API GATEWAy =============================
        list_gateway_clusters: async() => {
            const exitObj = await fx.base.exec(commands["api:list_api_gateways"].command)
            if (exitObj.exitStatus == 0){
                const data = await Promise.all((JSON.parse(exitObj.out)).map(async gw => ({
                    ...gw,
                    configFile: await window.electron.pathRelative(gw.configFile)
                })))
                
                return data
            }
            console.log(exitObj.out)
        },

        show_gw_logs: async(configFile, handlers) => {
            const absPath = await window.electron.pathJoin(configFile.split("/"))

            window.electron.spawn({
                command: 'docker',
                args: ["compose", "-f", absPath, "logs", "-f"]
            })

            window.electron.onSpawn(handlers.onSpawn)
            window.electron.onOutput(handlers.onOutput)
            window.electron.onExit(() => {
                handlers.onExit()
                window.electron.onSpawn(null)
                window.electron.onOutput(null)
                window.electron.onExit(null)
            })
        },
        
        list_vi_names: async() => {
            const exitObj = await fx.base.exec(commands["api:list_vi_names"].command)
            if (exitObj.exitStatus == 0) return exitObj.out
            console.error(exitObj)
        },
    
        list_lb_names: async() => {
            const exitObj = await fx.base.exec(commands["api:list_lb_names"].command)
            if (exitObj.exitStatus == 0) return exitObj.out
            console.error(exitObj)
        },

    }
}

export default fx