const Discord = require('discord.js')

module.exports = {
    name: "ticket",
    description: "Envoi le ticket",
    permission: Discord.PermissionFlagsBits.ManageChannels,
    dm: false,
    category: "Ticket",
    options: [
        {
            type: "string",
            name: "titre",
            description: "Titre du ticket",
            required: false,
            autocomplete: false
        }, {
            type: "string",
            name: "description",
            description: "Description du ticket",
            required: false,
            autocomplete: false
        }, {
            type: "role",
            name: "role",
            description: "Role pour le support",
            required: false,
            autocomplete: true
        },
    ],

    async run(client, message, args, db) {
        const Title = args.getString('titre') ?? "Ouverture d'un ticket"
        const Description = args.getString('description') ?? "Crée un ticket"
        const Role = args.getRole('role') ?? message.guild.roles.everyone
        if (!Role) return message.reply("Role invalide")

        const ticket = await db.Ticket.create({
            data: {
                serverID: message.guild.id,
                title: Title,
                description: Description,
                roleID: Role.id,
            },
        })

        let Embed = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setTitle(Title)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setDescription(Description)
            .setTimestamp()
            .setFooter({ text: `${client.user.username} - ${ticket.ticketID}`, iconURL: client.user.avatarURL({ dynamic: true }) })

        const btn = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
            .setCustomId("ticket")
            .setLabel("Crée un ticket")
            .setStyle(Discord.ButtonStyle.Primary)
            .setEmoji("🎫"))

        let messageTicket = await message.reply({ embeds: [Embed], components: [btn] })
        await db.ticket.update({
            where: {
                ticketID: ticket.ticketID
            },
            data: {
                messageID: messageTicket.id
            }
        })
    }
}