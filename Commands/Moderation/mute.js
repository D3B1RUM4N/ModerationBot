const Discord = require('discord.js')
const ms = require('ms')

module.exports = {
    name: "mute",
    description: "mute un membre",
    permission : Discord.PermissionFlagsBits.ModerateMembers,
    dm : false,
    category : "Moderation",
    options : [
        {
            type: "user",
            name: "membre",
            description: "Membre à mute",
            required: true,
            autocomplete : false
        }, {
            type: "string",
            name: "temps",
            description: "Temps du mute (ex: 1d, 1h, 1m, 1s)",
            required: true,
            autocomplete : false
        }, {
            type: "string",
            name: "raison",
            description: "Raison du mute",
            required: false,
            autocomplete : false
        }
    ],

    async run(client, message, args) {

        let user = args.getUser("membre")
        if (!user) return message.reply("Membre invalide")
        let member = message.guild.members.cache.get(user.id)
        if (!member) return message.reply("Membre invalide")

        let time = args.get("temps")?.value ?? "";
        if (!time) return message.reply("Temps invalide")
        if(isNaN(ms(time))) return message.reply("Temps invalide")
        if(ms(time) > 2419200000) return message.reply("Le mute ne peut duré plus de 28 jours")

        let reason = args.get("raison")?.value ?? "";
        if (!reason) reason = "Aucune raison donnée";

        if (message.user.id === user.id) return message.reply("Essaie pas de t'auto-mute")
        if ((await message.guild.fetchOwner()).id === user.id) return message.reply("Tu ne peux pas mute le propriétaire du serveur")
        if (!member.moderatable) return message.reply("Je ne peux pas mute ce membre")
        if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply("Tu ne peux pas mute ce membre")
        if (member.isCommunicationDisabled()) return message.reply("Ce membre est déjà mute")
        

        try{await user.send(`Tu as été mute du serveur ${message.guild.name} par ${message.user.tag} pendant ${time} pour la raison suivante :\n \`\`\`${reason}\`\`\` `)} catch(err) {}

        await message.reply(`${message.user} a mute ${user.tag} pour la raison suivante :\n \`\`\`${reason}\`\`\` `)
        await member.timeout(ms(time), reason)

    }
}