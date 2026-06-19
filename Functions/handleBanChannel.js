module.exports = async (client, message) => {
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

            //envoyer un mp
            try {
                await message.author.send(`Vous avez été banni du serveur ${message.guild.name} pour avoir écrit dans le channel de bannissement automatique.`)
            } catch (err) {
                console.error(`Impossible d'envoyer un message privé à ${message.author.tag}.`, err)
            }
            try { await user.send(`Tu as été banni du serveur ${message.guild.name} par ${message.user.tag} pour la raison suivante :\n \`\`\`${reason}\`\`\` `) } catch (err) { }

            //await message.reply(`${message.user} a bannis ${user.tag} pour la raison suivante :\n \`\`\`${reason}\`\`\` `)
            await message.guild.bans.create(user.id, { reason: reason })
        } catch (err) {
            console.log("membre invalide ==> catch")
            //logs.log("membre invalide ==> catch")
            //return message.reply("Membre invalide")
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
