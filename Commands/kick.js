const Discord = require('discord.js')
const logs = require('../Functions/log.js')

module.exports = {
    name : "kick",
    description : "kick un utilisateur",
    permission : Discord.PermissionFlagsBits.KickMembers, 
    dm : false,
    category : "Moderation",
    options : [
        {
            type : "user",
            name : "membre",
            description : "Membre à kick",
            required : true,
            autocomplete : false
        }, {
            type : "string",
            name : "raison",
            description : "Raison du kick",
            required : false,
            autocomplete : false
        }
    ],

    async run(client, message, args){
        logs.log(`[${new Date().toISOString()}]\t ${message.user.tag} a envoyé "${message}" dans le canal ${message.channel.name}`);


        let user = args.getUser("membre")
        if(!user) return message.reply("Membre invalide")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("Membre invalide")

        let reason = args.get("raison")?.value ?? "";
        if(!reason) reason = "Aucune raison donnée";

        if(message.user.id === user.id) return message.reply("Essaie pas de t'auto-kick")
        if((await message.guild.fetchOwner()).id === user.id) return message.reply("Tu ne peux pas kick le propriétaire du serveur")
        if(!member?.bannable) return message.reply("Je ne peux pas kick ce membre")
        if(member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas kick ce membre")
        if((await message.guild.bans.fetch()).get(user.id)) return message.reply("Ce membre est déjà kick")

        try{await user.send(`Tu as été kick du serveur ${message.guild.name} par ${message.user.tag} pour la raison suivante :\n \`\`\`${reason}\`\`\` `)} catch(err) {logs.log(err)}

        await message.reply(`${message.user} a kick ${user.tag} pour la raison suivante :\n \`\`\`${reason}\`\`\` `)
        await member.kick(reason)
    

    }
}