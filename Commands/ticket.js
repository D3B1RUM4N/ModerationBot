const Discord = require('discord.js')
const roleExist = require('../Functions/roleExist.js')

module.exports = {
    name: "ticket",
    description: "Envoi le ticket",
    permission: Discord.PermissionFlagsBits.ManageChannels,
    dm: false,
    category: "Ticket",
    options: [
        {
            type: "role",
            name: "role",
            description: "Role pour le support",
            required: true,
            autocomplete: true
        }, {
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
        },
    ],

    async run(client, message, args, db) {
        const title = args.getString('titre') ?? "Ouverture d'un ticket"
        const description = args.getString('description') ?? "Crée un ticket"
        const role = args.getRole('role')
        if (!role) return message.reply("Role invalide")

        await roleExist.roleExist(role.id, db)

        const ticket = await db.Ticket.create({
            data: {
                serverID: message.guild.id.toString(),
                title: title,
                description: description,
                roleID: role.id,
            },
        })

        const ticketMessage = await db.TicketMessage.create({
            data: {
                title: "Bienvenu dans le ticket",
                description: "Pose ta question ici",
                ticketID: ticket.ticketID
            }
        })

        let Embed = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setTitle(title)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setDescription(description)
            .setTimestamp()
            .setFooter({ text: `${client.user.username} - ${ticket.ticketID}`, iconURL: message.guild.iconURL({ dynamic: true }) })

        const btn = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
            .setCustomId("ticket-" + ticket.ticketID)
            .setLabel("Créer un ticket")
            .setStyle(Discord.ButtonStyle.Primary)
            .setEmoji("🎫"))


        await message.reply({ content: `Ticket cree avec succes, role support : ${role.name}`, ephemeral: true })
        let messageTicket = await message.channel.send({ embeds: [Embed], components: [btn] })

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