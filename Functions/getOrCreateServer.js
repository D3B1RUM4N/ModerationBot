module.exports = async (client, message) => {
    // Check if the server is in the database, if not, add it
    let server = await client.db.server.findFirst({
        where: {
            serverID: message.guild.id
        }
    })
    if (!server) {
        server = await client.db.server.create({
            data: {
                serverID: message.guild.id,
                serverName: message.guild.name
            }
        })
    }
    return server
}
