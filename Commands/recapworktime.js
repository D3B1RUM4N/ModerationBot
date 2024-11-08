const Discord = require('discord.js')
const logs = require('../Functions/log')
const ms = require('ms');
const { name } = require('./ban');


module.exports = {
    name: "recapworktime",
    description: "voir le recapitulaif de son temps de travail",
    permission: "Aucune",
    dm: false,
    category: "Projet",

    options: [
        {
            type: "string",
            name: "projet",
            description: "Projet dont vous voulez reucperer le recapitulatif",
            required: false,
            autocomplete: false
        },
        {
            type: "boolean",
            name: "all",
            description: "Recupere le recapitulatif de tous les membres",
            required: false,
            autocomplete: false
        }

    ],

    async run(client, message, args, db) {
        let projet = args.getString("projet") || "Aucun projet"
        let all = args.getBoolean("all")
        let workTime
        try {
            if (!projet) {
                if (all) {
                    //check serverID
                    workTime = await db.WorkTime.findMany({ where: { projet: projet, serverID: message.guild.id } })
                } else {
                    workTime = await db.WorkTime.findMany({ where: { projet: projet, userID: message.user.id, serverID: message.guild.id } })
                }
            } else {
                if (all) {
                    workTime = await db.WorkTime.findMany({ where: { serverID: message.guild.id } })
                } else {
                    workTime = await db.WorkTime.findMany({ where: { userID: message.user.id, serverID: message.guild.id } })
                }
            }

            if (!workTime) return message.reply("Aucune tache sur se projet")
            // message contenant toutes les tahces
            let Embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setTitle(`Recapitulatif des taches sur le projet ${projet}`)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setFooter({ text: "Commandes du Robot" });
            workTime.forEach(wt => {
                Embed.addFields({ name: `Tache : ${wt.task}`, value: `Temps : ${ms(wt.workTime, { long: true })} ||id : ${wt.workTimeID}||` })
            })

            let total = 0;
            workTime.forEach(wt => {
                total += wt.workTime;
            })
            return message.reply({
                content: `\nTemps de travail sur le projet ${projet} : ${ms(total, { long: true })}`,
                embeds: [Embed]
            });


        } catch (err) {
            console.error(err)
            return message.reply("Une erreur est survenue")
        }
    }
}