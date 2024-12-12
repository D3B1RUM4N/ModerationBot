const Discord = require('discord.js')
const logs = require('../Functions/log')


module.exports = {
    name: "getworktimecsv",
    description: "Ajoute ton temps de travail sur une tache",
    permission: "Aucune",
    dm: false,
    category: "Projet",

    options: [],

    async run(client, message, args, db) {
        logs.log(`[${new Date().toISOString()}]\t ${message.user.tag} a envoyé "${message}" dans le canal ${message.channel.name}`);
        //generate csv with database
        let csv = "ID,Date,Projet,Tache,Description,Time,Estimated Time,User\n"
        const workTime = await db.WorkTime.findMany({ where: { serverID: message.guild.id } })
        workTime.forEach(wt => {
            csv += `${wt.workTimeID},${wt.dateWorkTime},${wt.projet},"${wt.task}","${wt.comment}",${wt.workTime},${wt.estimatedTime},"${client.users.cache.get(wt.userID)?.tag || 'Unknown User'}"\n`
        })
        message.reply({ content: "Voici le fichier csv", files: [{ attachment: Buffer.from(csv), name: "workTime.csv" }] })
    }
}