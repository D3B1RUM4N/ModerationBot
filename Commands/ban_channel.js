const Discord = require('discord.js')
const logs = require('../Functions/log.js')

module.exports = {
    name: "ban_channel",
    description: "ajout d'un salon à surveiller pour bannir les spammeurs",
    permission: Discord.PermissionFlagsBits.ManageChannels,
    dm: false,
    category: "Administration",
    options: [
        {
            type: "channel",
            name: "salon",
            description: "Salon à surveiller",
            required: true,
            autocomplete: true
        }
    ],

    async run(client, message, args, db) {
        logs.log(`[${new Date().toISOString()}]\t ${message.user.tag} a envoyé "${message}" dans le canal ${message.channel.name}`);


        let channel = args.getChannel("salon")
        if (!channel) return message.reply("Salon invalide")

        const serverChannel = await db.banChannel.findUnique({
            where: {
                serverID: message.guild.id.toString(),
                channelID: channel.id.toString()
            }
        });

        if (!serverChannel) {
            await db.banChannel.create({
                data: {
                    channelID: channel.id.toString(),
                    serverID: message.guild.id.toString()
                }
            });
        } else {
            await db.banChannel.update({
                where: {
                    serverID: message.guild.id.toString(),
                    channelID: channel.id.toString()
                },
                data: {
                    channelID: channel.id.toString()
                }
            })
        }
        await message.reply(`Salon de bannissement automatique défini sur #${channel.name}`)

        // ecris un message dans ce channel pour prévenir que ce channel permet de detecter les spammeurs et de les bannir automatiquement. toute personne qui ecris ici sera bannis
        const embed = new Discord.EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Salon de bannissement automatique')
            .setDescription('Ce salon est utilisé pour détecter les spammeurs et les bannir automatiquement. Toute personne qui écrit ici sera bannie.')
            .setFooter({ text: 'ModerationBot' })
            .setTimestamp();

        await channel.send({ embeds: [embed] });
    }
}