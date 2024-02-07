const Discord = require('discord.js')

module.exports = async (client, member) => {
    let channel
    let channelID

    try {
        await client.db.each('SELECT * from Welcome where serverID = ?', [member.guild.id], (err, rows) => {
            if (!rows) {
                console.log("No channel found")
                return
            } else {
                console.log("rows : " + rows.channelID)
                channelID = rows.channelID
            }
        });
        channel = await client.channels.fetch(channelID)

    } catch (err) {
        console.log(err)
    }


    if (!channel) {
        console.log(`no channel found`)
        return;
    }

    console.log(member.user.tag + ` Joined the server ${member.guild.name}`);

    let Embed = new Discord.EmbedBuilder()
        .setTitle(`Bienvenue sur le serveur ${member.guild.name}`)
        .setDescription(`Bienvenue sur le serveur ${member.guild.name}, ${member.user.tag} !`)
        .setColor(client.color)
        .setTimestamp()
        .setThumbnail(member.user.displayAvatarURL())

    channel.send({ embeds: [Embed] });
    //await message.reply({embeds : [Embed]});
}