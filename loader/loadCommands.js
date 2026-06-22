const fs = require('fs');
const path = require('path');

function loadCommandFiles(directory, client) {
    fs.readdirSync(directory).forEach(file => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            loadCommandFiles(filePath, client);
            return;
        }

        if (!file.endsWith('.js')) return;

        const command = require(filePath);
        if (!command.name || typeof command.name !== 'string') throw TypeError(`la commande ${path.basename(file, '.js')} n\'a pas de nom ou n\'est pas une string`)
        client.commands.set(command.name, command);
        console.log(`Commande chargée: ${command.name}`)
    })
}

module.exports = async client => {
    loadCommandFiles(path.join(__dirname, '..', 'Commands'), client);
}