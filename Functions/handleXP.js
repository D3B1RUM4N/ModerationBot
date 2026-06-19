module.exports = async (client, message, server) => {
    // Check if the server has xp enabled, if so, add xp to the user
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
}
