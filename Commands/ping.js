const Discord = require('discord.js')

module.exports = {
    name: "ping",
    description: "Affiche la latence du bot !",
    permission : "Aucune",
    dm : true,
    category : "Utilitaire",

    

    async run(client, message) {

        await message.reply(`Pong :ping_pong: : \`${client.ws.ping}\` ms :)`)
    }
}