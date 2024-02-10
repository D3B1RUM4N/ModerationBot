const Discord = require('discord.js')
const Canvas = require('discord-canvas-easy')


module.exports = {
    name: "rank",
    description: "affiche le rank d'un membre",
    permission: "Aucune",
    dm: false,
    category: "Rank",

    options: [
        {
            type: "user",
            name: "membre",
            description: "l'xp du membre a voir",
            required: false,
            autocomplete: true

        }, 
    ],

    async run(client, message, args, db) {
        let user;
        if (args.getUser('membre')) {
            user = args.getUser('membre')
            if(!user || !message.guild.members.cache.get(user?.id)) return message.reply("Membre invalide")
        }else{
            user = message.user
        }

        let xp = await db.experience.findFirst({
            where: {
                serverID: message.guild.id,
                userID: user.id
            }
        })

        if(!xp) return message.reply("Ce membre n'a pas d'xp")

        await message.deferReply()

        let allXp = await db.experience.findMany({
            where: {
                serverID: message.guild.id
            }
        })

        await allXp.sort( async (a, b) => (await client.function.calculXP(b.xp, b.level)) - (await client.function.calculXP(a.xp, a.level)))
            
        let rank = allXp.findIndex(x => x.userID === user.id) + 1
        let need = (xp.level + 1) * 100 


        let Card = await new Canvas.Card()
        //local image

        .setBackground('public/image/card_background.png')
        .setBot(client)
        .setColorFont('#ffffff')
        .setRank(rank)
        .setUser(user)
        .setColorProgressBar('#00FF00')
        .setGuild(message.guild)
        .setXp(xp.xp)
        .setLevel(xp.level)
        .setXpNeed(need)
        .toCard()

        const buffer = await Card.toBuffer()
        await message.followUp({files: [new Discord.AttachmentBuilder(Card.toBuffer(), "rank.png")]})
    }
}