const Discord = require('discord.js')
const logs = require('../Functions/log.js')

module.exports = {
    name: "welcomming",
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
        },
        {
            type: "role",
            name: "role",
            description: "Role à donner",
            required: false,
            autocomplete: true
        }
    ],

    async run(client, message, args, db) {
        logs.log(`[${new Date().toISOString()}]\t ${message.user.tag} a envoyé "${message}" dans le canal ${message.channel.name}`);


        let channel = args.getChannel("salon")
        if (!channel) return message.reply("Salon invalide")

        let role = args.getRole("role")
        if (!role) {
            role = message.guild.roles.everyone
        } else {
            const member = message.guild.members.cache.get(client.user.id); // Récupère le membre du bot dans le serveur
            if (role && role.comparePositionTo(member.roles.highest) >= 0) return message.reply("Je ne peux pas donner ce role")
        }






        try {
            await db.run(`DELETE FROM Welcome WHERE serverID = ?`, [message.guild.id])

            db.run(`INSERT INTO Welcome (channelID, roleID, serverID) VALUES (?, ?, ?)`, [channel.id, role.id, message.guild.id])
        } catch (err) {
            return message.reply("Erreur sur la base de donnée, veuillez réessayer plus tard")
        }

        await message.reply(`Salon de bienvenue défini sur #${channel.name} ${role ? `avec le role ${role.name}` : ""}`)
    }
}