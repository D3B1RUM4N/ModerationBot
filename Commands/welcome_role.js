const Discord = require('discord.js')
const logs = require('../Functions/log.js')

module.exports = {
    name: "welcome_role",
    description: "ajout d'un role automatique",
    permission: Discord.PermissionFlagsBits.ManageRoles,
    dm: false,
    category: "Gestion de serveur",
    options: [
        {
            type: "role",
            name: "role",
            description: "Role a donner",
            required: true,
            autocomplete: true
        }
    ],

    async run(client, message, args, db) {
        logs.log(`[${new Date().toISOString()}]\t ${message.user.tag} a envoyé "${message}" dans le canal ${message.channel.name}`);

        let role = args.getRole("role")
        if (!role) {
            role = message.guild.roles.everyone
        } else {
            const member = message.guild.members.cache.get(client.user.id); // Récupère le membre du bot dans le serveur
            if (role && role.comparePositionTo(member.roles.highest) >= 0) return message.reply("Je ne peux pas donner ce role")
        }


        const serverRole = await db.role.findUnique({
            where: {
                serverID: message.guild.id.toString(),
                roleID: role.id.toString()
            }
        });

        if (!serverRole) {
            await db.role.create({
                data: {
                    roleID: role.id,
                    serverID: message.guild.id.toString()
                }
            });
        } else {
            await db.role.update({
                where: {
                    serverID: message.guild.id.toString(),
                    roleID: role.id.toString()
                },
                data: {
                    roleID: role.id
                }
            })
        }
        await message.reply(`Role automatique sur @${role.name}`)
    }
}