const Discord = require('discord.js')


module.exports = {
    name: "enable_xp",
    description: "Activer/Desactivé l'xp sur le serveur",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Rank",

    async run(client, message, args, db) {
        let server = await client.db.server.findFirst({
            where: {
                serverID: message.guild.id
            }
        })
        if (!server) {
            server = await client.db.server.create({
                data: {
                    serverID: message.guild.id,
                    serverName: message.guild.name
                }
            })
        }

        server = await client.db.server.update({
            where: {
                serverID: message.guild.id
            },
            data: {
                enable_xp: !server.enable_xp
            }
        })

        message.reply(`L'xp est maintenant ${server.enable_xp ? "activé" : "desactivé"}`)
    }
}