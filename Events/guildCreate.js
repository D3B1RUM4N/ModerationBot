const Discord = require('discord.js')

module.exports = async (client, guild) => {
    console.log(`Le bot a rejoint le serveur : ${guild.name} (ID: ${guild.id})`);

    try {
        const server = await client.db.server.findUnique({
            where: {
                serverID: guild.id.toString()
            }
        });

        if (!server) {
            await client.db.server.create({
                data: {
                    serverID: guild.id.toString(),
                    serverName: guild.name
                }
            });
        }
    } catch (err) {
        console.error(err)
    }

}
