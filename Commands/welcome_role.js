const Discord = require('discord.js')
const logs = require('../Functions/log.js')

module.exports = {
    name: "welcome_role",
    description: "ajout d'un role automatique",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    category: "Moderation",
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






        try {
            await db.run(`DELETE FROM Role WHERE serverID = ?`, [message.guild.id])

            db.run(`INSERT INTO Role (roleID, serverID) VALUES (?, ?)`, [role.id, message.guild.id])
        } catch (err) {
            return message.reply("Erreur sur la base de donnée, veuillez réessayer plus tard")
        }

        await message.reply(`Role automatique sur @${role.name}`)
    }
}