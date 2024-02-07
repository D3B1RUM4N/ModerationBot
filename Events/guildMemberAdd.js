const Discord = require('discord.js')

module.exports = async (client, member) => {
    const channel = await fetchChannel(client, member);

    if (!channel) {
        console.log(`not a channel`)
        return;
    }

    console.log(member.user.tag + ` Joined the server ${member.guild.name}`);

    let Embed = new Discord.EmbedBuilder()
        .setTitle(`Bienvenue sur le serveur ${member.guild.name}`)
        .setDescription(`Bienvenue sur le serveur ${member.guild.name} !`)
        .setColor(client.color)
        .setTimestamp()
        .setThumbnail(member.user.displayAvatarURL())

    channel.send({ embeds: [Embed] });
    //await message.reply({embeds : [Embed]});
}

// function to fetch channel
function fetchChannel(client, member) {
    return new Promise((resolve, reject) => {
        try {
            client.db.each('SELECT * from Welcome where serverID = ?', [member.guild.id], async (err, rows) => {
                if (!rows) {
                    console.log("No channel found");
                    resolve(null);
                } else {
                    console.log("rows : " + rows.channelID);
                    const channelID = rows.channelID;
                    const channel = await client.channels.fetch(channelID);
                    resolve(channel);
                }
            });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}