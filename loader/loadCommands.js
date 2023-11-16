const fs = require('fs');

module.exports = async client => {

    fs.readdirSync("./Commands/").filter(f => f.endsWith(".js")).forEach(async file => {
        
        let command = require(`../Commands/${file}`);
        if(!command.name || typeof command.name !== "string") throw TypeError(`la commande ${file.slice(0, file.length - 3)} n\'a pas de nom ou n\'est pas une string`)
        client.commands.set(command.name, command);
        console.log(`Commande chargée: ${command.name}`)
    })
}