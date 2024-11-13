const Discord = require('discord.js')
const logs = require('../Functions/log')
const ms = require('ms')


module.exports = {
    name: "addworktime",
    description: "Ajoute ton temps de travail sur une tache",
    permission: "Aucune",
    dm: false,
    category: "Projet",

    options: [
        {
            type: "string",
            name: "tache",
            description: "Tache effectuée",
            required: true,
            autocomplete: false
        }, {
            type: "string",
            name: "temps",
            description: "Temps sur la tache (ex: 1d, 1h, 1m, 1s)",
            required: true,
            autocomplete: false
        }, {
            type: "string",
            name: "projet",
            description: "Projet sur lequel vous avez travaillé",
            required: true,
            autocomplete: true
        }, {
            type: "string",
            name: "date",
            description: "Date de la tache (ex: 2021-08-01)",
            required: false,
            autocomplete: false
        }, {
            type: "string",
            name: "description",
            description: "Description de la tache",
            required: false,
            autocomplete: false
        }
    ],

    async run(client, message, args, db) {
        logs.log(`[${new Date().toISOString()}]\t ${message.user.tag} a envoyé "${message}" dans le canal ${message.channel.name}`);

        let task = args.getString("tache")
        let time = args.getString("temps")
        let date = args.getString("date") || new Date().toISOString().split('T')[0]
        let description = args.getString("description") || "Aucune description"
        let projet = args.getString("projet") || "Aucun projet"

        if (isNaN(ms(time))) return message.reply("Temps invalide")
        if (ms(time) > 2419200000) return message.reply("Le temps ne peut duré plus de 28 jours")

        try {
            const workTime = await db.WorkTime.create({
                data: {
                    serverID: message.guild.id,
                    userID: message.user.id,
                    task: task,
                    workTime: ms(time),
                    dateWorkTime: date,
                    comment: description,
                    projet: projet
                }
            })
            // i want a better looking recap
            let Embed = new Discord.EmbedBuilder()
                .setTitle(`Temps de travail ajouté pour la tâche **${workTime.task}**`)
                .addFields(
                    { name: "Temps de travail", value: ms(workTime.workTime), inline: true },
                    { name: "Projet", value: workTime.projet, inline: true },
                    { name: "Date", value: workTime.dateWorkTime, inline: true },
                    { name: "Description", value: workTime.comment }
                );

            await message.reply({ embeds: [Embed] });


        } catch (err) {
            logs.log(err)
            return message.reply("Une erreur est survenue")
        }

    }
}