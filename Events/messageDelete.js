const Discord = require('discord.js')

module.exports = async (client, deletedMessage) => {
    //console.log("messag suppr : ", deletedMessage.id)

    const ticket = await client.db.Ticket.findFirst({
        where: {
            messageID: deletedMessage.id
        }
    })
    if (ticket) {
        await client.db.Ticket.delete({
            where: {
                ticketID: ticket.ticketID
            }
        })
    }

}