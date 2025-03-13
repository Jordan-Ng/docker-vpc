import commands from "../../commands"
import { notifications } from "@mantine/notifications"

const exec = (command) => {

    return new Promise((res, rej) => {
        window.electron.runCommand(command)
        .then(data => res(data))
        .catch(err => rej(err))
    })
}

const spawn = (command) => {
    return new Promise((res, rej) => {
        window.electron.spawn(command, callback).then(data => res(data))
        .catch(err => rej(err))
    })
}

// export
const fx = {
    // ======= Base =======
    base: {
        exec: (command) => {
            return new Promise((res, rej) => {
                window.electron.runCommand(command)
                .then(data => res(data))
                .catch(err => rej(err))
            })
        },

        spawn : (command) => {
            return new Promise((res, rej) => {
                window.electron.spawn(command).then(data => res(data))
                .catch(err => rej(err))
            })
        },

        notify : (isSuccessful=true, notificationObj) => {
            
            isSuccessful ? notifications.show({
                    title: "Success!",
                    message: notificationObj.message,
                    position: "top-right"
                }) 
                : notifications.show({
                    title: "Error!",
                    message: notificationObj.message,
                    position: "top-right"
                })
        }
    },

    // ======= Volumes =======
    volume: {
        create: (volName) => {    
            return exec(commands["volume:create:fx"].command(volName))
            .then(data => data)            
            .catch(err => err)
        },

        list: () => {
            return exec(commands["volume:list_all_format_short"].command)
            .then(data => data.out)
            .catch(err => err)
        },

        list_attachments: (volName) => {
            return exec(commands["volume:list_attachments:fx"].command(volName))
            .then(data => data.out)
            .catch(err => console.log(err))
        },

        delete: (volumeArray) => {
            const volumes = volumeArray.join(" ")
            return exec(commands["volume:delete:fx"].command(volumes))
            .then(data => data)
            .catch(err => console.log(err))
        }
    },

    ec2: {
        list_instances: () => {
            return exec(commands["ec2:list_instances"].command)
            .then(data => data.out)
            .catch(err => err.toString())
        },

        delete_instances: async (instancesArray) => {
            const instances = instancesArray.join(" ")
            
            return exec(`./bin/instance_cleanup.sh "${instances}"`)
            .then(data => data)
            .catch(err => err.toString())
            // return exec(commands["ec2:delete_instances:fx"].command(instances))
            // .then(data => data)
            // .catch(err => err.toString())
        },

        list_os_images: () => {
            return exec(commands["ec2:list_os_images"].command)
            .then(data => data.out)
            .catch(err => console.log("list_os_image", err))
        },

        list_networks: () => {
            return exec(commands["ec2:list_networks"].command)
            .then(data => data.out)
            .catch(err => console.log("list_networkk", err))
        },

        list_ports_in_use: () => {
            return exec(commands["ec2:list_ports_in_use"].command)
            .then(exitObj => {if (exitObj.exitStatus == 0) return exitObj.out})
            .then(stdout => stdout)
            .catch(err => console.log(err))
        },

        is_valid_instance_name: (volName) => {
            return exec(commands["ec2:get_container_information:fx"].command(volName))
            .then((data) => false)
            .catch((err) => true)
        },

        build_instance: () => {
            return spawn(commands["ec2:build_image_from_dockerfile:fx"].command())
            .then((data) => data)
            .catch(err => console.log(err))
        },

        cat_dockerfile: (pathArgs) => {            
            return window.electron.pathJoin(pathArgs)
            .then(absPath => exec(commands["ec2:cat_dockerfile:fx"].command(absPath)))
            .then(data => data)
            .catch(err => {throw new Error(err.toString())})
        },

        ssh_instance: (targetCont, onStdout, onExit) => {
            window.electron.pathJoin(["bin", "instance_ssh.sh"])            
            .then(absPath => window.electron.spawn({
                command: absPath,
                args: [...targetCont]
            }))
            .catch(err => console.log(err))

            window.electron.onOutput(onStdout)
            window.electron.onExit(onExit)
        },
        
        list_lb_cluster_info: () => {            
            return exec(commands["ec2:list_lb_cluster_info"].command)
            .then(exitObj => {
                if (exitObj.exitStatus === 0) return exitObj.out;
            })
            .then(data => {
                let cluster_info = JSON.parse(data);                
        
                return Promise.all(cluster_info.map(async (cluster, ind) => {    

                    cluster_info[ind].status = cluster_info[ind].status.at(-1) == ')' ? cluster_info[ind].status.substr(0, cluster_info[ind].status.length - 3) : cluster_info[ind].status
                    
                    const inspectData = await exec(`docker inspect $(docker ps -aq --filter "label=com.docker.compose.project=${cluster.name}") \
                    --format '{{json .}}' | jq -s '[.[] | {name: .Name, machine_image: .Config.Image, state: .State.Status, network: .HostConfig.NetworkMode, labels: .Config.Labels}]'`)
        
                    if (inspectData.exitStatus === 0) {
                        
                        const raw = JSON.parse(inspectData.out);
                        cluster_info[ind].components = raw.map(dt => {
                            if (dt.labels.container_type != "vm_instance"){
                                cluster_info[ind].network = dt.network
                            }
                            return {
                                name: dt.name.substring(1),
                                network: dt.network,
                                state: dt.state,
                                machine_image: dt.machine_image,
                                type: dt.labels.container_type == "vm_instance" ? dt.labels.container_type : "load balancer",
                                application_port: dt.labels.container_type == "vm_instance" ? dt.labels[`traefik.http.services.${dt.machine_image}.loadbalancer.server.port`] : "80"
                            }
                    });
                    } else {
                        cluster_info[ind].components = []
                    }
                })).then(() => cluster_info)
            });
        },

        start_lb_cluster: (composeFile) => {
            return exec(commands["ec2:start_lb_cluster:fx"].command(composeFile))
            .then(exitObj => exitObj)
            .catch(err => console.log(err))
        },

        stop_lb_cluster: (composeFile) => {
            return exec(commands["ec2:stop_lb_cluster:fx"].command(composeFile))
            .then(exitObj => exitObj)
            .catch(err => console.log(err))
        }
        
    }   
}

export default fx