const Discord = require('discord.js')

module.exports = async (client, interaction) => {

    if (interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {

        let entry = interaction.options.getFocused()

        const focusedOption = interaction.options._hoistedOptions.find(option => option.focused);
        const focusedOptionName = focusedOption ? focusedOption.name : null;
        //console.log(focusedOptionName);

        if (interaction.commandName === "help") {
            
            let choices = client.commands.filter(cmd => cmd.name.includes(entry))
            await interaction.respond(entry === "" ? client.commands.map(cmd => ({ name: cmd.name, value: cmd.name })) : choices.map(choice => ({ name: choice.name, value: choice.name })))
        }

        // if (interaction.commandName === "ticket_message") {
        //     console.log("ticket")
        //     let choices = ["ticketID", "titre", "description"]
        //     // let choices = await client.db.Ticket.findMany({
        //     //     where: {
        //     //         serverID: interaction.guild.id.toString()
        //     //     }
        //     // })
        //     console.log("choices : ",choices)
        //     let sortie = choices.filter(c => c.ticketID.toString().includes(entry))
        //     await interaction.respond(entry === "" ? choices.map(c => ({ name: c.ticketID.toString(), value: c.ticketID.toString() })) : sortie.map(c => ({ name: c.ticketID.toString(), value: c.ticketID.toString() })))
        // }

        if (interaction.commandName === "reaction_roles" && interaction.options.getSubcommand() === "action") {
            let choices = ["add", "remove"]
            let sortie = choices.filter(c => c.includes(entry))
            await interaction.respond(entry === "" ? choices.map(c => ({ name: c, value: c })) : sortie.map(c => ({ name: c, value: c })))
        }

        if (interaction.commandName === "reaction_roles" && interaction.options.getSubcommand() === "reactionID") {
            let choices = await client.db.reactionroles.findMany({
                where: {
                    serverID: interaction.guild.id
                }
            })
            let sortie = choices.filter(c => c.id.toString().includes(entry))
            await interaction.respond(entry === "" ? choices.map(c => ({ name: c.id.toString(), value: c.id.toString() })) : sortie.map(c => ({ name: c.id.toString(), value: c.id.toString() })))
        }

    }

    if (interaction.type === Discord.InteractionType.ApplicationCommand) {

        let command = require(`../Commands/${interaction.commandName}`);
        command.run(client, interaction, interaction.options, client.db);
    }

    if (String(interaction.customId).startsWith("ticket-")) {
        const id = interaction.customId.split("-")[1]
        const messageTicket = await client.db.TicketMessage.findFirst({
            where: {
                ticketID: Number(id)
            }
        })
        const ticket = await client.db.Ticket.findFirst({
            where: {
                ticketID: Number(id)
            }
        })


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
        await channel.permissionOverwrites.create(interaction.guild.roles.cache.get(ticket.roleID), {
            ViewChannel: true,
            EmbedLinks: true,
            AttachFiles: true,
            ReadMessageHistory: true,
            SendMessages: true
        })
        await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
            ViewChannel: false
        })


        await interaction.reply({ content: `Le ticket a été crée dans ${channel}`, ephemeral: true })

        await channel.setTopic(interaction.user.id)
        let Embed = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setTitle(messageTicket.title ?? "Bienvenu dans le ticket")
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setDescription(messageTicket.description ?? "Pose ta question ici")
            .setTimestamp()
            .setFooter({ text: interaction.user.username, iconURL: interaction.guild.iconURL({ dynamic: true }) })

        const btn = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
            .setCustomId("close_ticket")
            .setLabel("Fermer le ticket")
            .setStyle(Discord.ButtonStyle.Danger)
            .setEmoji("🔒"))

        await channel.send({ embeds: [Embed], components: [btn] })
    }

    if (interaction.customId === "close_ticket") {
        let user = client.users.cache.get(interaction.channel.topic)
        try { await user.send(`Votre ticket de ${interaction.guild.name} a été fermé`) } catch (err) { }

        await interaction.channel.delete()
    }
}