const Discord = require('discord.js')
const stupid = require('../Functions/stupid')
const lienRegex = /https?:\/\/\S+/;


module.exports = async (client, message) => {
    //console.log("nouveau message : ", message.id)
    if (message.author.bot) return
    if (message.content.startsWith("/")) return
    if (lienRegex.test(message.content)) return

    stupid(message)




    // a optimiser
    // check if the server is in the database, if not, add it
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
    // check if the server has xp enabled, if so, add xp to the user
    if (server.enable_xp) {
        let db = client.db
        let xp = await db.experience.findFirst({
            where: {
                serverID: message.guild.id,
                userID: message.author.id
            }
        })
        if (!xp) {
            await db.experience.create({
                data: {
                    serverID: message.guild.id,
                    userID: message.author.id,
                    xp: 1,
                    level: 0
                }
            })
        } else {
            let xpToAdd = Math.floor(Math.random() * 25) + 1
            if ((xp.level + 1) * 100 <= xp.xp + xpToAdd) {
                await db.experience.update({
                    where: {
                        userID_serverID: {
                            userID: message.author.id,
                            serverID: message.guild.id
                        }
                    },
                    data: {
                        xp: 0,
                        level: xp.level + 1
                    }
                })
                message.channel.send(`Bravo ${message.author} tu es passé niveau ${xp.level + 1}`)
            } else {
                await db.experience.update({
                    where: {
                        userID_serverID: {
                            userID: message.author.id,
                            serverID: message.guild.id
                        }
                    },
                    data: {
                        xp: xp.xp + xpToAdd
                    }
                });
            }
        }
    }
    // check if the server has a ban channel, if so, check if the message was sent in that channel, if so, ban the user
    let banChannel = await client.db.banChannel.findFirst({
        where: {
            serverID: message.guild.id,
            channelID: message.channel.id
        }
    })
    if (banChannel) {
        try {

            let user = message.author
            let member = message.guild.members.cache.get(user.id)
            if (!user) return message.reply("Membre invalide")


            let reason = "Ecris dans le channel de bannissement!";

            if ((await message.guild.fetchOwner()).id === user.id) return message.reply("T'as le droit d'ecrire <3")
            if (!member?.bannable) return message.reply("T'as de la chance que je peux pas te ban")
            if ((await message.guild.bans.fetch()).get(user.id)) return message.reply("Ce membre est déjà ban")

            try { await user.send(`Tu as été banni du serveur ${message.guild.name} par ${message.user.tag} pour la raison suivante :\n \`\`\`${reason}\`\`\` `) } catch (err) { }

            //await message.reply(`${message.user} a bannis ${user.tag} pour la raison suivante :\n \`\`\`${reason}\`\`\` `)
            await message.guild.bans.create(user.id, { reason: reason })
        } catch (err) {
            console.log("membre invalide ==> catch")
            //logs.log("membre invalide ==> catch")
            //return message.reply("Membre invalide")
        }

        //envoyer un mp
        try {
            await message.author.send(`Vous avez été banni du serveur ${message.guild.name} pour avoir écrit dans le channel de bannissement automatique.`)
        } catch (err) {
            console.error(`Impossible d'envoyer un message privé à ${message.author.tag}.`, err)
        }

        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const channels = await message.guild.channels.fetch()

        for (const channel of channels.values()) {
            if (channel.isTextBased()) {
                try {
                    const messages = await channel.messages.fetch({ limit: 100 })
                    const userMessages = messages.filter(msg => msg.author.id === message.author.id && msg.createdTimestamp > twentyFourHoursAgo.getTime())
                    for (const msg of userMessages.values()) {
                        await msg.delete()
                    }
                } catch (err) {
                    console.error(`Erreur lors de la suppression des messages dans ${channel.name}:`, err)
                }
            }
        }
    }
}