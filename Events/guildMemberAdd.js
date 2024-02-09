const Discord = require('discord.js')

module.exports = async (client, member) => {
    const channel = await fetchChannel(client, member);
    const role = await fetchRole(client, member);

    if (role) {
        console.log(`role found: ${role.name}`)
        member.roles.add(role).catch(err => console.log(err));
    }

    if (!channel) {
        console.log(`not a channel`)
        return;
    }

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
async function fetchChannel(client, member) {
    try {
        const channelID = await client.db.welcome.findFirst({
            where: {
                serverID: member.guild.id.toString()
            }
        })
        const channel = await client.channels.fetch(channelID.channelID);
        return channel;
    } catch (err) {
        console.log(err);
    }


    /*return new Promise((resolve, reject) => {
        try {
            client.db.each('SELECT * from Welcome where serverID = ?', [member.guild.id], async (err, rows) => {
                if (!rows) {
                    resolve(null);
                } else {
                    const channelID = rows.channelID;
                    const channel = await client.channels.fetch(channelID);
                    resolve(channel);
                }
            });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });*/
}

// function to fetch role
async function fetchRole(client, member) {
    try {
        const roleID = await client.db.role.findFirst({
            where: {
                serverID: member.guild.id.toString()
            }
        })
        const role = await member.guild.roles.fetch(roleID.roleID);
        return role;
    } catch (err) {
        console.log(err);
    }
    /*return new Promise((resolve, reject) => {
        try {
            client.db.each('SELECT * from Welcome where serverID = ?', [member.guild.id], async (err, rows) => {
                if (!rows) {
                    resolve(null);
                } else {
                    const roleID = rows.roleID;
                    const role = await member.guild.roles.fetch(roleID);
                    resolve(role);
                }
            });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });*/
}