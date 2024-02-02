const Discord = require('discord.js')
const stupid = require('../stupid')
const lienRegex = /https?:\/\/\S+/;


module.exports = async (client, message) => {
    if (message.author.bot) return
    if (message.content.startsWith("/")) return
    if (lienRegex.test(message.content)) return
    //redirigé vers le fichier stupid.js
    stupid(message)
}