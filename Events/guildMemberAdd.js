const Discord = require('discord.js')

module.exports = async (client, member) => {
    let channel
    const channelID = '1202892373810614302';

    try {
        const rows = await client.db.get('SELECT * from Welcome where serverID = ?', [member.guild.id]);
        if (!rows) {
            console.log("No channel found");
            return;
        }

        console.log("rows : " + rows.channelID); // Assurez-vous que rows.channelID est un nombre
        const channel = await client.channels.fetch(channelID);
        console.log("Fetched channel : " + channel.name);
    } catch (err) {
        console.log(err);
    }


    if (!channel) {
        console.log(`no channel found with : ${channelID}`)
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