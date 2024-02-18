const Discord = require('discord.js')
const logs = require('../Functions/log.js')

module.exports = {
    name: "welcome_channel",
    description: "ajout d'un salon de bienvenue",
    permission: Discord.PermissionFlagsBits.ManageChannels,
    dm: false,
    category: "Gestion de serveur",
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

        const serverChannel = await db.welcome.findUnique({
            where: {
                serverID: message.guild.id.toString(),
                channelID: channel.id.toString()
            }
        });

        if (!serverChannel) {
            await db.welcome.create({
                data: {
                    channelID: channel.id.toString(),
                    serverID: message.guild.id.toString()
                }
            });
        } else {
            await db.welcome.update({
                where: {
                    serverID: message.guild.id.toString(),
                    channelID: channel.id.toString()
                },
                data: {
                    channelID: channel.id.toString()
                }
            })
        }
        await message.reply(`Salon de bienvenue défini sur #${channel.name}`)
    }
}