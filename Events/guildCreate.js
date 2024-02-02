const Discord = require('discord.js')

module.exports = async (client, guild) => {
    console.log(`Le bot a rejoint le serveur : ${guild.name} (ID: ${guild.id})`);

    try {
        let server

        await client.db.each('SELECT * FROM servers WHERE server_id = ?', [guild.id], (err, rows) => {
            if (!rows) {
                client.db.run('INSERT INTO Server (serverID, serverName) VALUES (?, ?)', [guild.id, guild.name]);
            }
        });
    } catch (err) {
        console.error(err)
    }

}
