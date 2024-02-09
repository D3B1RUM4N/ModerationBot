const Discord = require('discord.js')
const stupid = require('../Functions/stupid')
const lienRegex = /https?:\/\/\S+/;


module.exports = async (client, message) => {
    if (message.author.bot) return
    if (message.content.startsWith("/")) return
    if (lienRegex.test(message.content)) return

    stupid(message)

    /*let db = client.db
    let xp = db.experience.findFirst({
        where: {
            serverID: message.guild.id,
            userID: message.author.id
        }
    })*/
}