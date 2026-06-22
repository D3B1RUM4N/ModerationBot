const Discord = require('discord.js')

module.exports = {
    name : "unban",
    description : "Ban un utilisateur",
    permission : Discord.PermissionFlagsBits.BanMembers, 
    dm : false,
    category : "Moderation",
    options : [
        {
            type : "user",
            name : "utilisateur",
            description : "Utilisateur à unban",
            required : true,
            autocomplete : false
        }, {
            type : "string",
            name : "raison",
            description : "Raison de l'unban",
            required : false,
            autocomplete : false
        }
    ],

    async run(client, message, args){

        try {

            let user = args.getUser("utilisateur")
            if(!user) return message.reply("pas d'utilisateur à unban")

            let reason = args.get("raison")?.value ?? "";
            if(!reason) reason = "Aucune raison donnée";

            if(!(await message.guild.bans.fetch()).get(user.id)) return message.reply("Cet utilisateur n'est pas ban")

            try{await user.send(`Tu as été Débanni du serveur ${message.guild.name} par ${message.user.tag} pour la raison suivante :\n \`\`\`${reason}\`\`\` `)} catch(err){}
            await message.reply(`${message.user} a débannis ${user.tag} pour la raison suivante :\n \`\`\`${reason}\`\`\` `)

            await message.guild.bans.remove(user.id, {reason : reason})

        }catch(err){
            console.log("membre invalide ==> catch")

            return message.reply("pas d'utilisateur à unban")
        }

    }
}