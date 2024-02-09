const Discord = require('discord.js')


module.exports = {
    name: "warnlist",
    description: "Affiche la liste des warns d'un membre",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Moderation",

    options: [
        {
            type: "user",
            name: "membre",
            description: "le membre à surveiller",
            required: true,
            autocomplete: false

        }, 
    ],

    async run(client, message, args, db) {
        let user = args.getUser('membre')
        if (!user) return message.reply("Membre invalide")

        let member = message.guild.members.cache.get(user.id)
        if (!member) return message.reply("Membre invalide")

        const warnliste = db.warnlist.findall({
            where : {
                serverID: message.guild.id,
                userID: user.id
            }
        })
        if (!warnliste) return message.reply("Ce membre n'a pas de warn")

        let embed = new Discord.MessageEmbed()
            .setTitle(`Liste des warns de ${user.tag}`)
            .setColor(client.color)
            .setTimestamp()
            .setFooter(client.user.tag, client.user.displayAvatarURL())
            .setThumbnail(user.displayAvatarURL())
            .setDescription(`Ce membre a été warn ${warnliste.length} fois`)
        for (let warn of warnliste) {
            embed.addField(`Warn ID : ${warn.warnID}`, `Raison : ${warn.reason}\nWarn le : ${warn.date}`)
        }
        message.reply({ embeds: [embed] })
    }
}