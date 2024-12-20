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
            required: true,
            autocomplete: true
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
        logs.log(`[${new Date().toISOString()}]\t ${message.user.tag} a envoyé "${message}" dans le canal ${message.channel.name}`);

        let projet = args.getString("projet") || "Aucun projet"
        let all = args.getBoolean("all") || false
        let workTime
        try {
            if (projet !== "Tout") {
                if (all) {
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

            if (!workTime?.length) return message.reply("Aucune tache sur ce projet");

            // Get the last 25 elements
            const lastEntries = workTime.slice(-25);

            let Embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setTitle(`Recapitulatif des taches sur le projet ${projet}`)
                .setThumbnail(message.user.displayAvatarURL())
                .setTimestamp()
                .setFooter({ text: "Commandes du Robot" });

            lastEntries.forEach(wt => {
                Embed.addFields({
                    name: `Tache : ${wt.task}`,
                    value: `Temps : ${ms(wt.workTime, { long: true })} ||id : ${wt.workTimeID}||`
                });
            });

            let total = workTime.reduce((acc, wt) => acc + wt.workTime, 0);

            const formatDuration = (milliseconds) => {
                const seconds = Math.floor((milliseconds / 1000) % 60);
                const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
                const hours = Math.floor(milliseconds / (1000 * 60 * 60));
                return `${hours}h ${minutes}m ${seconds}s`;
            };

            return message.reply({
                content: `\nTemps de travail sur le projet ${projet} : ${formatDuration(total)}`,
                embeds: [Embed]
            });

        } catch (err) {
            console.error(err)
            return message.reply("Une erreur est survenue")
        }
    }
}