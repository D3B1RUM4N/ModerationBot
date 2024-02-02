const Discord = require('discord.js')
const logs = require('../Functions/log')

module.exports = {
    name: "ban",
    description: "Ban un utilisateur",
    permission: Discord.PermissionFlagsBits.BanMembers,
    dm: false,
    category: "Moderation",

    options: [
        {
            type: "user",
            name: "membre",
            description: "Membre à ban",
            required: true,
            autocomplete: false
        }, {
            type: "string",
            name: "raison",
            description: "Raison du ban",
            required: false,
            autocomplete: false

        }
    ],

    async run(client, message, args) {
        logs.log(`[${new Date().toISOString()}]\t ${message.user.tag} a envoyé "${message}" dans le canal ${message.channel.name}`);

        try {

            let user = await client.users.fetch(args._hoistedOptions[0].value)
            if (!user) return message.reply("Membre invalide")


            let member = message.guild.members.cache.get(user.id)

            let reason = args.get("raison")?.value ?? "";
            if (!reason) reason = "Aucune raison donnée";

            if (message.user.id === user.id) return message.reply("Essaie pas de t'auto-ban")
            if ((await message.guild.fetchOwner()).id === user.id) return message.reply("Tu ne peux pas ban le propriétaire du serveur")
            if (!member?.bannable) return message.reply("Je ne peux pas ban ce membre")
            if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas ban ce membre")
            if ((await message.guild.bans.fetch()).get(user.id)) return message.reply("Ce membre est déjà ban")

            try { await user.send(`Tu as été banni du serveur ${message.guild.name} par ${message.user.tag} pour la raison suivante :\n \`\`\`${reason}\`\`\` `) } catch (err) { }

            await message.reply(`${message.user} a bannis ${user.tag} pour la raison suivante :\n \`\`\`${reason}\`\`\` `)
            await message.guild.bans.create(user.id, { reason: reason })
        } catch (err) {
            console.log("membre invalide ==> catch")
            logs.log("membre invalide ==> catch")
            return message.reply("Membre invalide")
        }
    }
}