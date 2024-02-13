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
            name: "ticketID",
            description: "ID du ticket",
            required: false,
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
    }
}