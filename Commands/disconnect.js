const Discord = require('discord.js')
const logs  = require('../Functions/log')


module.exports = {
    name: "disconnect",
    description: "Deconnecte le bot",
    permission : Discord.PermissionFlagsBits.Administrator,
    dm : false,
    category : "Moderation",

    

    async run(client, message) {
        await message.reply(`bot déconnecté`)
        logs.log(`[${new Date().toISOString()}]\t ${message.user.tag} a envoyé "${message}" dans le canal ${message.channel.name}`);
        logs.log("Bot déconnecté\n\n\n\n");
        client.destroy()
        
    }
}