const Discord = require('discord.js')

module.exports = {
    name: "reaction_message",
    description: "envoi d'un message de reaction role",
    permission: Discord.PermissionFlagsBits.ManageRoles,
    dm: false,
    category: "Gestion de serveur",
    options: [],

    async run(client, message, args, db) {
        reaction = await db.reactionroles.create({
            data: {
                serverID: message.guild.id.toString()
            }
        })
        const menu = new Discord.ActionRowBuilder().addCompenents(new Discord.RoleSelectMenuBuilder()
            .setCustomId(`reactionrole`)
            .setMinValues(0)
            .setMaxValues(roles.length)
        )
    }
}