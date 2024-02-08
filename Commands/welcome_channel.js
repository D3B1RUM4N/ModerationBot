const Discord = require('discord.js')
const logs = require('../Functions/log.js')

module.exports = {
    name: "welcome_channel",
    description: "ajout d'un salon de bienvenue",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    category: "Moderation",
    options: [
        {
            type: "channel",
            name: "salon",
            description: "Salon bienvenue",
            required: true,
            autocomplete: true
        }
    ],

    async run(client, message, args, db) {
        logs.log(`[${new Date().toISOString()}]\t ${message.user.tag} a envoyé "${message}" dans le canal ${message.channel.name}`);


        let channel = args.getChannel("salon")
        if (!channel) return message.reply("Salon invalide")

        try {
            await db.run(`DELETE FROM Welcome WHERE serverID = ?`, [message.guild.id])

            db.run(`INSERT INTO Welcome (channelID, serverID) VALUES (?, ?)`, [channel.id, message.guild.id])
        } catch (err) {
            return message.reply("Erreur sur la base de donnée, veuillez réessayer plus tard")
        }

        await message.reply(`Salon de bienvenue défini sur #${channel.name}`)
    }
}