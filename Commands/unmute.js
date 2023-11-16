const Discord = require('discord.js')
const ms = require('ms')

module.exports = {
    name: "unmute",
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

        let reason = args.get("raison")?.value ?? "";
        if (!reason) reason = "Aucune raison donnée";

        if ((await message.guild.fetchOwner()).id === user.id) return message.reply("Tu ne peux pas mute le propriétaire du serveur")
        
        if (!member.moderatable) return message.reply("je ne peux pas un-mute se membre")
        if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply("Tu ne peux pas un-mute ce membre")
        if (!member.isCommunicationDisabled()) return message.reply("Ce membre n'est pas mute")
        

        try{await user.send(`Tu as été unmute du serveur ${message.guild.name} par ${message.user.tag} pour la raison suivante :\n \`\`\`${reason}\`\`\` `)} catch(err) {}

        await message.reply(`${message.user} a unmute ${user.tag} pour la raison suivante :\n \`\`\`${reason}\`\`\` `)
        await member.timeout(null, reason)

    }
}