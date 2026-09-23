const Discord = require('discord.js');
const logs = require('../../Functions/log.js');
const { addBirthdayToCache } = require('../../Functions/birthdayScheduler.js');

module.exports = {
    name: "birthday",
    description: "Afficher, définir ou supprimer ton anniversaire",
    permission: "Aucune",
    dm: false,
    category: "Utilitaire",
    options: [
        {
            type: "string",
            name: "action",
            description: "Action à effectuer",
            required: true,
            choices: [
                { name: "Définir mon anniversaire", value: "set" },
                { name: "Voir un anniversaire", value: "show" },
                { name: "Supprimer mon anniversaire", value: "remove" }
            ]
        },
        {
            type: "integer",
            name: "jour",
            description: "[Set] Jour de naissance (1 - 31)",
            required: false
        },
        {
            type: "integer",
            name: "mois",
            description: "[Set] Mois de naissance (1 - 12)",
            required: false
        },
        {
            type: "user",
            name: "membre",
            description: "[Show] Membre dont vous voulez voir l'anniversaire",
            required: false
        }
    ],

    async run(client, message, args, db) {
        const action = args.getString("action");

        // --- 1. DÉFINIR MON ANNIVERSAIRE ---
        if (action === "set") {
            const day = args.getInteger("jour");
            const month = args.getInteger("mois");

            if (!day || !month || day < 1 || day > 31 || month < 1 || month > 12) {
                return message.reply({ content: "⚠️ Veuillez fournir un jour (1-31) et un mois (1-12) valides.", ephemeral: true });
            }

            await db.userBirthday.upsert({
                where: { userID: message.user.id.toString() },
                update: { day, month },
                create: { userID: message.user.id.toString(), day, month }
            });

            // Injection immédiate en cache si c'est aujourd'hui
            addBirthdayToCache(message.user.id.toString(), day, month);

            return message.reply({ content: `🎂 Ton anniversaire a été enregistré au **${day}/${month}** !`, ephemeral: true });
        }

        // --- 2. VOIR UN ANNIVERSAIRE ---
        if (action === "show") {
            const targetUser = args.getUser("membre") || message.user;
            const bday = await db.userBirthday.findUnique({
                where: { userID: targetUser.id.toString() }
            });

            if (!bday) {
                return message.reply({
                    content: `${targetUser.id === message.user.id ? "Tu n'as" : `${targetUser.username} n'a`} pas encore enregistré d'anniversaire.`,
                    ephemeral: true
                });
            }

            return message.reply({ content: `📅 L'anniversaire de **${targetUser.username}** est le **${bday.day}/${bday.month}**.` });
        }

        // --- 3. SUPPRIMER MON ANNIVERSAIRE ---
        if (action === "remove") {
            await db.userBirthday.deleteMany({
                where: { userID: message.user.id.toString() }
            });

            return message.reply({ content: "🗑️ Ton anniversaire a été supprimé de la base de données.", ephemeral: true });
        }
    }
};