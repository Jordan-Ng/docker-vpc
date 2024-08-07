// format => module : action : isFunction

const commands = {
    "base:docker_ps": "docker ps",
    "base:docker_image": "docker image",
    "base:docker_volume" : "docker volume",

    "ps:list_all:format_short" : {
        description: "lists all containers in short form (cont_name, status)",
        command: `
        docker ps -a 
        --format '{"cont_name" : "{{ .Names}}", "status" : "{{.Status}}" }`
    },

    "volume:list_all_format_short" : {
        description: "lists all volumes in short form (name, drive, mountpoint)",
        // command: `
        // docker volume ls --format '{{ json . }}' \
        // | jq -s 'map({name:.Name, driver:.Driver, mountpoint:.Mountpoint})'`
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

    "volume:list_attachments:fx" : {
        description: "lists containers a given volume is attached to",
        command: (volName) => (
            `docker ps -a \
            --filter volume=${volName} \
            --format '{{ json . }}' \
            | jq -s 'map({"Container Name": .Names, "Status": .Status})'`
        )
    },

    "volume:create:fx" : {
        description: "create container",
        command: (volName) => (
            `docker volume create ${volName}`
        )
    },

    "volume:delete:fx" : {
        description: "delete containers. Expects space separated values",
        command: (volumes) => (
            `docker volume rm ${volumes}`
        )
    },
    
    "ec2:list_os_images" : {
        description: "list available images on the machine",
        command: `docker image inspect $(docker images --format "{{.Repository}} ") --format json \
        | jq '[.[] | {"repo" : .RepoTags, "labels" : .Config.Labels}]' `        
    },

    "ec2:get_container_information:fx" : {
        description: "get information for a specific container",
        command: (contName) => (
            `docker container inspect ${contName}`
        )
    },

    "ec2:build_image_from_dockerfile:fx" : {
        description: "build image from dockerfile located at given path",
        command: () => (
            // `docker build -t test_cont ./poc`
            {
                command: "docker",
                args: ["build", "-t", "test_cont", "./poc"]
            }
        )
    },

    "ec2:cat_dockerfile:fx" : {
        description: "list contents of dockerfile to stdout",
        command: (pathName) => {            
            return `cat ${pathName}`
        }
    }
}

export default commands