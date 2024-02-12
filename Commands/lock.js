const Discord = require('discord.js')
const logs = require('../Functions/log.js')

module.exports = {
    name : "lock",
    description : "Lock un salon",
    permission : Discord.PermissionFlagsBits.ManageChannels, 
    dm : false,
    category : "Moderation",
    options : [
        {
            type : "channel",
            name : "salon",
            description : "salon a lock",
            required : false,
            autocomplete : true
        }, {
            type : "role",
            name : "role",
            description : "Role a lock",
            required : false,
            autocomplete : true
        }
    ],

    async run(client, message, args){
        let channel = args.getChannel("salon") ?? message.channel
        if(!message.guild.channel.cache.get(channel.id)) return message.reply("Salon invalide")
        if(channel.type !== Discord.ChannelType.GuildText && channel.type !== Discord.ChannelType.PublicThread && channel.type !== Discord.ChannelType.PrivateThread) return message.reply("Salon invalide")

        let role = args.getRole("role") ?? message.guild.roles.everyone
        if(!message.guild.roles.cache.get(role.id)) return message.reply("Role invalide")

        if(channel.permissionOverwrites.cache.get(role.id)?.deny()) //6min
    }
}

