const Discord = require('discord.js')
const Canvas = require('discord-canvas-easy')


module.exports = {
    name: "leaderboard",
    description: "Donne le leaderboard du serveur",
    permission: "Aucune",
    dm: false,
    category: "Rank",

    options: [],

    async run(client, message, args, db) {
        let allXp = await db.experience.findMany({
            where: {
                serverID: message.guild.id
            }
        })
        if(!allXp) return message.reply("Aucun membre n'a d'xp")

        await message.deferReply()

        let leaderboard = allXp.sort( async (a, b) => (await client.function.calculXP(b.xp, b.level)) - (await client.function.calculXP(a.xp, a.level)))

        const Leaderboard = await new Canvas.Leaderboard()
        .setBot(client)
        .setGuild(message.guild)
        .setBackground('public/image/leaderboard_background.png')
        .setColorFont('#ffffff')
        for (let i = 0; i < 10 && i < leaderboard.length; i++) {
            if(leaderboard[i]){
                let user = await client.users.fetch(leaderboard[i].userID)
                Leaderboard.addUser(user, leaderboard[i].level, leaderboard[i].xp, (leaderboard[i].level + 1) * 100)
            }
        }

        const Image = await Leaderboard.toLeaderboard()

        await message.followUp({files: [new Discord.AttachmentBuilder(Image.toBuffer(), 'leaderboard.png')]})
    }
}