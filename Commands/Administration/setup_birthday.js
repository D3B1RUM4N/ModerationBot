const Discord = require('discord.js');
const logs = require('../../Functions/log.js');

module.exports = {
    name: "setup_birthday",
    description: "Configuration du système d'anniversaires sur le serveur",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Administration",
    options: [
        {
            type: "boolean",
            name: "actif",
            description: "Activer ou désactiver le système d'anniversaire",
            required: true
        },
        {
            type: "channel",
            name: "salon",
            description: "Salon où seront envoyées les annonces",
            required: false
        },
        {
            type: "string",
            name: "heure",
            description: "Heure d'envoi du message",
            required: false,
            choices: [
                { name: "06:00", value: "06:00" },
                { name: "08:00", value: "08:00" },
                { name: "09:00", value: "09:00" },
                { name: "10:00", value: "10:00" },
                { name: "11:00", value: "11:00" },
                { name: "12:00", value: "12:00" },
                { name: "14:00", value: "14:00" },
                { name: "15:00", value: "15:00" },
                { name: "16:00", value: "16:00" },
                { name: "18:00", value: "18:00" },
                { name: "20:00", value: "20:00" },
                { name: "22:00", value: "22:00" },
                { name: "23:00", value: "23:00" }
            ]
        },
        {
            type: "role",
            name: "role",
            description: "Rôle à mentionner lors de l'annonce",
            required: false
        },
        {
            type: "string",
            name: "message_perso",
            description: "Message personnalisé (utilise {user} pour mentionner le membre)",
            required: false
        }
    ],

    async run(client, message, args, db) {
        logs.log(`[${new Date().toISOString()}]\t ${message.user.tag} a utilisé /setup_birthday`);

        const active = args.getBoolean("actif");
        const channel = args.getChannel("salon");
        const heure = args.getString("heure");
        const role = args.getRole("role");
        const msgPerso = args.getString("message_perso");

        const currentConfig = await db.serverBirthdayConfig.findUnique({
            where: { serverID: message.guild.id.toString() }
        });

        const updatedConfig = await db.serverBirthdayConfig.upsert({
            where: { serverID: message.guild.id.toString() },
            update: {
                enabled: active,
                channelID: channel ? channel.id.toString() : currentConfig?.channelID,
                birthdayTime: heure || currentConfig?.birthdayTime || "09:00",
                roleID: role ? role.id.toString() : currentConfig?.roleID,
                birthdayMessage: msgPerso !== null ? msgPerso : currentConfig?.birthdayMessage
            },
            create: {
                serverID: message.guild.id.toString(),
                enabled: active,
                channelID: channel ? channel.id.toString() : null,
                birthdayTime: heure || "09:00",
                roleID: role ? role.id.toString() : null,
                birthdayMessage: msgPerso || null
            }
        });

        return message.reply({
            content: `⚙️ **Configuration Anniversaire mise à jour :**\n• Statut : **${updatedConfig.enabled ? "Activé ✅" : "Désactivé ❌"}**\n• Salon : ${updatedConfig.channelID ? `<#${updatedConfig.channelID}>` : "Non défini"}\n• Heure d'envoi : **${updatedConfig.birthdayTime}**\n• Rôle à pinger : ${updatedConfig.roleID ? `<&${updatedConfig.roleID}>` : "Aucun"}`
        });
    }
};