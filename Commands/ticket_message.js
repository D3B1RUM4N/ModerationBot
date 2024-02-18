const Discord = require('discord.js')

module.exports = {
    name: "ticket_message",
    description: "Ouverture de ticket customisé",
    permission: Discord.PermissionFlagsBits.ManageChannels,
    dm: false,
    category: "Ticket",
    options: [
        {
            type: "number",
            name: "ticket",
            description: "ID du ticket (indice : en bas du message du ticket)",
            required: true,
            autocomplete: true
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
        const ticketID = args.getNumber('ticket')
        const title = args.getString('titre') ?? "Bienvenu dans le ticket"
        const description = args.getString('description') ?? "Pose ta question ici"

        const ticket = await db.Ticket.findFirst({
            where: {
                ticketID: ticketID
            }
        })
        if (!ticket) return message.reply("Ticket invalide")

        const ticketMessage = await db.TicketMessage.findFirst({
            where: {
                ticketID: ticketID
            }
        })
        if(!ticketMessage) return message.reply("Erreur avec le ticket actuel")


        const newTicketMessage = await db.TicketMessage.update({
            where: {
                messageID: ticketMessage.messageID,
                ticketID: ticketID
            },
            data: {
                ticketID: ticketID,
                title: title,
                description: description,
            }
        })
        if(!newTicketMessage) return message.reply("Erreur lors de la création du message")

        return message.reply("Message modifié avec succès")
    }
}