const Discord = require('discord.js')

module.exports = async (client, interaction) => {

    if(interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {

        let entry = interaction.options.getFocused()

        if(interaction.commandName === "help"){

            let choices = client.commands.filter(cmd => cmd.name.includes(entry))
            await interaction.respond(entry === "" ? client.commands.map(cmd => ({name : cmd.name, value : cmd.name})) : choices.map(choice => ({name: choice.name, value: choice.name})))
        }
    }

    if(interaction.type === Discord.InteractionType.ApplicationCommand){

        let command = require(`../Commands/${interaction.commandName}`);
        command.run(client, interaction, interaction.options, client.db);
    }

    if(interaction.customId === "ticket"){
        let channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: Discord.ChannelType.GuildText
        })
        await channel.setParent(interaction.channel.parent.id)

        await channel.permissionOverwrites.create(interaction.user, {
            ViewChannel: true,
            EmbedLinks: true,
            AttachFiles: true,
            ReadMessageHistory: true,
            SendMessages: true
        })
        await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
            ViewChannel: false
        })

        
        await interaction.reply({content: `Le ticket a été crée dans ${channel}`, ephemeral: true})
        
        await channel.setTopic(interaction.user.id)
        let Embed = new Discord.EmbedBuilder()
        .setColor(client.color)
        .setTitle("Ouverture d'un ticket")
        .setThumbnail(interaction.guild.iconURL({dynamic : true}))
        .setDescription("Ticket crée")
        .setTimestamp()
        .setFooter({text : client.user.username, iconURL : client.user.avatarURL({dynamic : true})})

        const btn = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
        .setCustomId("close_ticket")
        .setLabel("Fermer le ticket")
        .setStyle(Discord.ButtonStyle.Danger)
        .setEmoji("🔒"))

        await channel.send({embeds: [Embed], components: [btn]})
    }

    if(interaction.customId === "close_ticket"){
        let user = client.users.cache.get(interaction.channel.topic)
        try {await user.send(`Votre ticket de ${interaction.guild.name} a été fermé`)} catch(err){}

        await interaction.channel.delete()
    }
}