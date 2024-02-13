const Discord = require('discord.js')

module.exports = {
    name: "message_ticket",
    description: "Ouverture de ticket customisé",
    permission: Discord.PermissionFlagsBits.ManageChannels,
    dm: false,
    category: "Ticket",
    options: [
        {
            type: "number",
            name: "ticketid",
            description: "ID du ticket",
            required: true,
            autocomplete: false
        }, {
            type: "string",
            name: "titre",
            description: "Titre du message",
            required: false,
            autocomplete: false
        }, {
            type: "string",
            name: "description",
            description: "Description du ticket",
            required: false,
            autocomplete: false
        }
    ],

    async run(client, message, args, db) {
        const ticketID = args.getNumber('ticketID')
        const Title = args.getString('titre') ?? "Bienvenu dans le ticket"
        const Description = args.getString('description') ?? "Pose ta question ici"

        const ticket = await db.Ticket.findFirst({
            where: {
                ticketID: ticketID
            }
        })
        if (!ticket) return message.reply("Ticket invalide")

        const ticketMessage = await db.TicketMessage.create({
            data: {
                ticketID: ticketID,
                title: Title,
                description: Description,
            }
        })
    }
}