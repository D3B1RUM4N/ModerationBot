const Discord = require('discord.js')
const loadSlashCommands = require('../loader/loadSlashCommands')

const loadDatabase = require('../loader/loadDatabase')

const logs = require('../Functions/log')


module.exports = async client => {

    client.db = await loadDatabase()
    client.db.connect(function () {
        console.log("Connecté à la base de données")
    })


    await loadSlashCommands(client)

    //set activity
    client.user.setActivity(" /help", {type : "LISTENING"}) //PLAYING, STREAMING, LISTENING, WATCHING, CUSTOM_STATUS 
    
          


    console.log(`${client.user.tag} est bien en ligne !`)
    logs.log(`${client.user.tag} est bien en ligne !`)
}