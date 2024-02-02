const Discord = require('discord.js')
const loadSlashCommands = require('../loader/loadSlashCommands')

const loadDatabase = require('../loader/loadDatabase')

const logs = require('../Functions/log')


module.exports = async client => {

    client.db = await loadDatabase()

    await loadSlashCommands(client)

    client.user.setPresence({
        activities: [{
            status: 'dnd',
            name: `/Help -> Liste des commandes`,
            type: Discord.ActivityType.Watching,
            url: 'https://discord.gg/acPCHR5Yqu'
        }],
    });

    console.log(`${client.user.tag} est bien en ligne !`)
    logs.log(`${client.user.tag} est bien en ligne !`)
    console.log(`done`)
}