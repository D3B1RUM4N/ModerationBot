const Discord = require('discord.js')
const logs = require('../Functions/log')
const ms = require('ms');
const { name } = require('./ban');


module.exports = {
    name: "deletworktime",
    description: "supprimer un temps de travail",
    permission: "Aucune",
    dm: false,
    category: "Projet",

    options: [
        {
            type: "number",
            name: "id",
            description: "ID du temps de travail",
            required: true,
            autocomplete: false
        }
    ],

    async run(client, message, args, db) {
        logs.log(`[${new Date().toISOString()}]\t ${message.user.tag} a envoyé "${message}" dans le canal ${message.channel.name}`);

        let id = args.getNumber("id")

        try {
            const workTime = await db.WorkTime.findFirst({ where: { workTimeID: id } })
            if (!workTime) return message.reply("Tache introuvable")
            await db.WorkTime.delete({ where: { workTimeID: id } })
            message.reply("Tache supprimée")
        } catch (error) {
            message.reply("Erreur lors de la suppression")
            logs.log(error)
        }
    }
}