const Discord = require('discord.js')
const ms = require('ms')
const logs = require('../Functions/log.js')


module.exports = {
    name: "warn",
    description: "Warn un membre",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Moderation",

    options: [
        {
            type: "user",
            name: "membre",
            description: "le membre a warn",
            required: true,
            autocomplete: false

        }, {
            type: "string",
            name: "raison",
            description: "La raison du warn",
            required: false,
            autocomplete: false
        }
    ],

    async run(client, message, args, db) {
        let user = args.getUser('membre')
        if (!user) return message.reply({ content: "Membre invalide" })
        let member = message.guild.members.cache.get(user.id)
        if (!member) return message.reply({ content: "Membre invalide" })

        let reason = args.getString('raison') || "Aucune raison fournie"

        if (message.user.id === user.id) return message.reply("Essaie pas de te warn toi même")
        if ((await message.guild.fetchOwner()).id === user.id) return message.reply("Tu ne peux pas warn le propriétaire du serveur")
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas warn ce membre")
        if ((await message.guild.members.fetchMe()).roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Je ne peux pas warn se membre")

        try { await user.send(`${message.user.tag} vous a warm sur le serveur ${message.guild.name} pour la raison suivante : \`${reason}\``) } catch (err) { }

        await message.reply(`vous avez warn ${user.tag} pour la raison suivante : \`${reason}\``)

        //let id = await client.function.createID("WARN")

        //db.run(`INSERT INTO warns (serverID, userID, authorID, warnID, reason, date) VALUES (?, ?, ?, ?, ?, ?)`, [message.guild.id, user.id, message.user.id, id, reason.replace(/'/g, "\\'"), Date.now()])
        const warn = await db.WarnList.create({
            data: {
                serverID: message.guild.id,
                userID: user.id,
                authorID: message.user.id,
                reason: reason.replace(/'/g, "\\'"),
                dateWarn: new Date(),
            },
        });
    }


}