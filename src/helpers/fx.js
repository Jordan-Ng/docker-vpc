import commands from "../../commands"

const exec = (command) => {

    return new Promise((res, rej) => {
        window.electron.runCommand(command)
        .then(data => res(data))
        .catch(err => rej(err))
    })
}

// export
const fx = {
    // ======= Volumes =======
    volume: {
        create: (volName) => {    
            return exec(commands["volume:create:fx"].command(volName))            
            .catch(err => console.log(err))
        },

        list: () => {
            return exec(commands["volume:list_all_format_short"].command)
            .then(data => data)
            .catch(err => console.log(err))
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

    }
}

export default fx