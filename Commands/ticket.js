const Discord = require('discord.js')

module.exports = {
    name : "ticket",
    description : "Envoi le ticket",
    permission : Discord.PermissionFlagsBits.ManageGuild, 
    dm : false,
    category : "Administration",
    options : [],

    async run(client, message, args){
        let Embed = new Discord.EmbedBuilder()
        .setColor(client.color)
        .setTitle("Ouverture d'un ticket")
        .setThumbnail(message.guild.iconURL({dynamic : true}))
        .setDescription("Crée un ticket")
        .setTimestamp()
        .setFooter({text : client.user.username, iconURL : client.user.avatarURL({dynamic : true})})

        const btn = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
        .setCustomId("ticket")
        .setLabel("Crée un ticket")
        .setStyle(Discord.ButtonStyle.Primary)
        .setEmoji("🎫"))

        await message.reply({embeds: [Embed], components: [btn]})
    }
}