// format => module : action : isFunction

const commands = {
    //  ========================= EC2 Dashboard =============================
    "ec2:list_instances" : {
        description: "list running instances with label = virtual_instances",
        command: `docker container ls -a --format '{{ json . }}' \
        | jq -s '
            map( 
                .Labels=( 
                .Labels 
                | split(",") 
                | map(split("=") 
                | {(.[0]): .[1]}) 
                | add ) ) 
            | map(select(.Labels.type=="virtual_instance"))'
        `        
    },

    "ec2:start_instance:fx" : {
        description: "start a given virtual instance",
        command: (vi) => `docker start ${vi}`
    },

    "ec2:stop_instance:fx" : {
        description: "stop a given virtual instance",
        command: (vi) => `docker stop ${vi}`
    },

    "ec2:delete_instances:fx" : {
        description: "delete virtual instances",
        command: (containers) => (`docker rm ${containers.join(' ')}`)
    },

    //  ========================= Create EC2 Instance =============================
    "ec2:list_ports_in_use" : {
        description: "list port numbers that are being used by other processes (3000 - 8999)",
        command: `lsof -i -Pn | awk -F: '{split($2, a, " "); if (a[1] ~ /^[0-9]+$/ && a[1] >= 3000 && a[1] <= 8999) {split(a[1], b, "->"); print b[1]}}' | sort -n | uniq | jq -R 'tonumber'`
    },

    "ec2:list_networks" : {
        description: "list available networks on docker",
        command: "docker network ls --format '{{json .}}' | jq '{name: .Name, driver: .Driver}' |jq -s '.'"
    },

    "ec2:get_container_information:fx" : {
        description: "get information for a specific container",
        command: (contName) => (
            `docker container inspect ${contName}`
        )
    },

    //  ========================= EC2 Volumes =============================
    "ec2:list_volumes_format_short" : {
        description: "lists all volumes in short form (name, drive, mountpoint)",        
        command: `docker system df -v --format '{{ json . }}' \
        | jq '.Volumes | map(
            {
                name: .Name,
                driver: .Driver, 
                size: .Size, 
                attachments: .Links,
                mountpoint: .Mountpoint
            })'`
    },

    "ec2:list_volume_attachments:fx" : {
        description: "lists containers a given volume is attached to",
        command: (volName) => (
            `docker ps -a \
            --filter volume=${volName} \
            --format '{{ json . }}' \
            | jq -s 'map({"Container Name": .Names, "Status": .Status})'`
        )
    },
    //  ========================= LB Dashboard =============================
    "ec2:list_lb_cluster_info" : {
        description: "list load balancer info on docker compose",
        command: "docker compose ls -a --format '{{json.}}' | jq -s '[.[] | select(.Name | test(\"lb-.\")) | {name: .Name, status: .Status, configFile: .ConfigFiles}]'"
    },

    "ec2:list_lb_cluster_components:fx" : {
        description: "list detailed information about load balancer target group",
        command: (tg_name) => (`docker inspect $(docker ps -aq --filter "label=com.docker.compose.project=${tg_name}") \
        --format '{{json .}}' | jq -s '[.[] | {name: .Name, machine_image: .Config.Image, state: .State.Status, network: .HostConfig.NetworkMode, labels: .Config.Labels}]'`)        
    },

    "ec2:stop_lb_cluster:fx" : {
        description: "stop running load balancer groups",
        command: (composeFile) =>  (`docker compose -f ${composeFile} stop`)
    },

    "ec2:start_lb_cluster:fx" : {
        description: "start load balancer groups",
        command: (composeFile) =>  (`docker compose -f ${composeFile} start`)
    },

    //  ========================= Create LB =============================
    "ec2:list_created_machine_images" : {
        description: "list docker images created via create instance. (w/ tag=vm_instance)",
        command: `docker image inspect $(docker images --format "{{.Repository}}") --format json \
        | jq '[.[] | select(.Config.Labels.container_type == "vm_instance") |  .Config.Labels.name]'
    `

    },    
    //  ========================= Create HTTP API Gateway =============================
    "api:list_api_gateways" : {
        description: "list gateway projects info on docker compose",
        command: "docker compose ls -a --format '{{json.}}' | jq -s '[.[] | select(.Name | test(\"gw_.\")) | {name: .Name, status: .Status, configFile: .ConfigFiles}]'"
    },

    "api:list_vi_names" : {
        description: "list only names of created virtual instances",
        command: `docker container ls -a --format '{{ json . }}' \
        | jq -s '
            map( 
                .Labels=( 
                .Labels 
                | split(",") 
                | map(split("=") 
                | {(.[0]): .[1]}) 
                | add ) ) 
            | map(select(.Labels.type=="virtual_instance"))
            | [.[].Names]'
        `      
    },
    "api:list_lb_names" : {
        description: "list only names of created load balancer target groups",
        command: "docker compose ls -a --format '{{json.}}' | jq -s '[.[] |  .Name]'"
    },

}

export default commands