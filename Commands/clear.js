const Discord = require('discord.js')
const ms = require('ms')
const logs = require('../Functions/log.js')


module.exports = {
    name : "clear",
    description : "efface des messages",
    permission : Discord.PermissionFlagsBits.ManageMessages, 
    dm : false,
    category : "Moderation",

    options : [
        {
            type : "number",
            name : "nombre",
            description : "Nombre de message à clear",
            required : true,
            autocomplete : false

        }, {
            type : "channel",
            name: "salon",
            description: "Salon à clear",
            required: false,
            autocomplete : false
        }
    ],

    async run(client, message, args){
        logs.log(`[${new Date().toISOString()}]\t ${message.user.tag} a envoyé "${message}" dans le canal ${message.channel.name}`);

        let channel = args.getChannel("salon") ?? message.channel
        if(channel.id !== message.channel.id && !message.guild.channels.cache.get(channel.id)) return message.reply("Salon invalide")

        let number = args.getNumber("nombre")
        if(parseInt(number) <=0 || parseInt(number)>=100) return message.reply("il vous faut un nombre entre 0 et 100 inclus")
        
        try{
            let messages = await channel.bulkDelete(parseInt(number))
            await message.reply({content: `j'ai bien supprimé \`${messages.size}\` messages`, ephemeral: true})
            logs.log(`${message.user.tag} a supprimé ${messages.size} messages dans le canal ${message.channel.name}`)
        } catch(err){
            let messages = [...(await channel.messages.fetch()).values()].filter(async m => m.createdAt <= ms("14d"))
            if(message.length <= 0) return message.reply("je n'ai pas pu supprimé de message")
            await channel.bulkDelete(messages)
            await message.reply({content: `j'ai pu uniquement supprimé \`${messages.size}\` messages`, ephemeral: true})

        }
    }

        
}