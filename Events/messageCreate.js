const Discord = require('discord.js')
const stupid = require('../Functions/stupid')
const getOrCreateServer = require('../Functions/getOrCreateServer')
const handleXP = require('../Functions/handleXP')
const handleBanChannel = require('../Functions/handleBanChannel')
const lienRegex = /https?:\/\/\S+/;


module.exports = async (client, message) => {
    //console.log("nouveau message : ", message.id)
    if (message.author.bot) return
    if (message.content.startsWith("/")) return
    if (lienRegex.test(message.content)) return

    stupid(message)

    // Get or create server
    const server = await getOrCreateServer(client, message)

    // Handle XP
    await handleXP(client, message, server)

    // Handle ban channel logic
    await handleBanChannel(client, message)
}