import commands from "../../commands"

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
        }
    },

    // ======= Volumes =======
    volume: {
        create: (volName) => {    
            return exec(commands["volume:create:fx"].command(volName))            
            .catch(err => console.log(err))
        },

        list: () => {
            return exec(commands["volume:list_all_format_short"].command)
            .then(data => data)
            .catch(err => err)
        },

        list_attachments: (volName) => {
            return exec(commands["volume:list_attachments:fx"].command(volName))
            .then(data => data)
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
        list_os_images: () => {
            return exec(commands["ec2:list_os_images"].command)
            .then(data => data)
            .catch(err => console.log("list_os_image", err))
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
        }
    }
}

export default fx