const Discord = require('discord.js');
const logs = require('../../Functions/log.js');

module.exports = {
    name: "event",
    description: "Gestion des événements récurrents (BK, réunions, etc.)",
    permission: Discord.PermissionFlagsBits.ManageChannels,
    dm: false,
    category: "Event",
    options: [
        {
            type: "string",
            name: "action",
            description: "Action à effectuer",
            required: true,
            choices: [
                { name: "Créer un événement", value: "create" },
                { name: "Lister les événements", value: "list" },
                { name: "Supprimer un événement", value: "delete" },
                { name: "Mettre en pause / Réactiver", value: "toggle_pause" },
                { name: "Sauter la prochaine occurrence", value: "skip" },
                { name: "Réaligner la récurrence", value: "edit_recurrence" }
            ]
        },
        {
            type: "channel",
            name: "salon",
            description: "[Créer] Salon où envoyer l'annonce",
            required: false
        },
        {
            type: "string",
            name: "titre",
            description: "[Créer] Titre de l'embed",
            required: false
        },
        {
            type: "string",
            name: "description",
            description: "[Créer] Message/Description (Markdown supporté)",
            required: false
        },
        {
            type: "string",
            name: "heure",
            description: "[Créer] Heure au format HH:mm (ex: 12:00)",
            required: false
        },
        {
            type: "number",
            name: "jour",
            description: "[Créer] Jour de la semaine",
            required: false,
            choices: [
                { name: "Lundi", value: 1 },
                { name: "Mardi", value: 2 },
                { name: "Mercredi", value: 3 },
                { name: "Jeudi", value: 4 },
                { name: "Vendredi", value: 5 },
                { name: "Samedi", value: 6 },
                { name: "Dimanche", value: 0 }
            ]
        },
        {
            type: "number",
            name: "intervalle",
            description: "[Créer/Modifier] Fréquence en semaines (1 = toutes les semaines, 2 = 1/2)",
            required: false
        },
        {
            type: "role",
            name: "role",
            description: "[Créer] Rôle à mentionner dans le message",
            required: false
        },
        {
            type: "string",
            name: "couleur",
            description: "[Créer] Code HEX couleur (ex: #FF8C00)",
            required: false
        },
        {
            type: "string",
            name: "image_url",
            description: "[Créer] Lien vers une image ou un GIF",
            required: false
        },
        {
            type: "number",
            name: "event_id",
            description: "[Delete/Pause/Skip/Edit] ID de l'événement concerné",
            required: false
        }
    ],

    async run(client, message, args, db) {
        logs.log(`[${new Date().toISOString()}]\t ${message.user.tag} a exécuté /event (${args.getString("action")})`);

        const action = args.getString("action");

        // --- 1. CRÉATION ---
        if (action === "create") {
            const channel = args.getChannel("salon");
            const title = args.getString("titre");
            const description = args.getString("description");
            const heure = args.getString("heure");
            const jour = args.getInteger("jour");
            const intervalle = args.getInteger("intervalle") || 1;
            const role = args.getRole("role");
            const couleur = args.getString("couleur") || "#FF8C00";
            const imageUrl = args.getString("image_url");

            if (!channel || !title || !description || !heure || jour === null) {
                return message.reply({ content: "⚠️ Veuillez préciser au moins : le salon, le titre, la description, l'heure et le jour.", ephemeral: true });
            }

            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(heure)) {
                return message.reply({ content: "⚠️ L'heure doit être au format HH:mm (ex: 12:00).", ephemeral: true });
            }

            const newEvent = await db.scheduledEvent.create({
                data: {
                    serverID: message.guild.id.toString(),
                    channelID: channel.id.toString(),
                    title,
                    description,
                    cronTime: heure,
                    dayOfWeek: jour,
                    intervalWeeks: intervalle,
                    anchorDate: new Date(),
                    color: couleur,
                    imageUrl: imageUrl || null,
                    roleID: role ? role.id.toString() : null
                }
            });

            return message.reply({ content: `✅ Événement récurrent créé avec succès ! (ID : **${newEvent.eventID}**)` });
        }

        // --- 2. LISTING ---
        if (action === "list") {
            const events = await db.scheduledEvent.findMany({
                where: { serverID: message.guild.id.toString() }
            });

            if (events.length === 0) {
                return message.reply({ content: "Aucun événement récurrent configuré sur ce serveur." });
            }

            const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
            const embed = new Discord.EmbedBuilder()
                .setTitle("📅 Événements Récurrents")
                .setColor("#FF8C00")
                .setTimestamp();

            events.forEach(e => {
                const status = e.paused ? "⏸️ En pause" : (e.skipNext ? "⏭️ Prochaine passée" : "✅ Actif");
                embed.addFields({
                    name: `ID ${e.eventID} : ${e.title}`,
                    value: `• **Salon :** <#${e.channelID}>\n• **Horaire :** Tous les ${days[e.dayOfWeek]}s à ${e.cronTime} (toutes les ${e.intervalWeeks} sem.)\n• **Statut :** ${status}`
                });
            });

            return message.reply({ embeds: [embed] });
        }

        // --- 3. SUPPRESSION ---
        if (action === "delete") {
            const eventId = args.getInteger("event_id");
            if (!eventId) return message.reply({ content: "⚠️ Veuillez préciser l'ID de l'événement.", ephemeral: true });

            const deleted = await db.scheduledEvent.deleteMany({
                where: { eventID: eventId, serverID: message.guild.id.toString() }
            });

            if (deleted.count === 0) {
                return message.reply({ content: "⚠️ Aucun événement trouvé avec cet ID.", ephemeral: true });
            }

            return message.reply({ content: `🗑️ Événement #${eventId} supprimé.` });
        }

        // --- 4. MISE EN PAUSE / RÉACTIVATION ---
        if (action === "toggle_pause") {
            const eventId = args.getInteger("event_id");
            if (!eventId) return message.reply({ content: "⚠️ Veuillez préciser l'ID de l'événement.", ephemeral: true });

            const event = await db.scheduledEvent.findUnique({ where: { eventID: eventId } });
            if (!event || event.serverID !== message.guild.id.toString()) {
                return message.reply({ content: "⚠️ Événement introuvable sur ce serveur.", ephemeral: true });
            }

            const updated = await db.scheduledEvent.update({
                where: { eventID: eventId },
                data: { paused: !event.paused }
            });

            return message.reply({ content: `Événement #${eventId} ${updated.paused ? "mis en pause ⏸️" : "réactivé ✅"}.` });
        }

        // --- 5. SAUTER LA PROCHAINE OCCURRENCE ---
        if (action === "skip") {
            const eventId = args.getInteger("event_id");
            if (!eventId) return message.reply({ content: "⚠️ Veuillez préciser l'ID de l'événement.", ephemeral: true });

            const event = await db.scheduledEvent.findUnique({ where: { eventID: eventId } });
            if (!event || event.serverID !== message.guild.id.toString()) {
                return message.reply({ content: "⚠️ Événement introuvable sur ce serveur.", ephemeral: true });
            }

            await db.scheduledEvent.update({
                where: { eventID: eventId },
                data: { skipNext: true }
            });

            return message.reply({ content: `⏭️ La prochaine occurrence de l'événement #${eventId} sera sautée.` });
        }

        // --- 6. RÉALIGNER / MODIFIER LA RÉCURRENCE ---
        if (action === "edit_recurrence") {
            const eventId = args.getInteger("event_id");
            const newInterval = args.getInteger("intervalle");

            if (!eventId) {
                return message.reply({ content: "⚠️ Veuillez préciser l'ID de l'événement.", ephemeral: true });
            }

            const event = await db.scheduledEvent.findUnique({ where: { eventID: eventId } });
            if (!event || event.serverID !== message.guild.id.toString()) {
                return message.reply({ content: "⚠️ Événement introuvable sur ce serveur.", ephemeral: true });
            }

            const updated = await db.scheduledEvent.update({
                where: { eventID: eventId },
                data: {
                    intervalWeeks: newInterval || event.intervalWeeks,
                    anchorDate: new Date(), // Réaligne l'alternance des semaines sur la semaine actuelle
                    paused: false,
                    skipNext: false
                }
            });

            return message.reply({
                content: `🔄 Événement #${eventId} réaligné ! Nouvelle fréquence : **1 fois toutes les ${updated.intervalWeeks} semaine(s)** (cycle reparti de cette semaine).`
            });
        }
    }
};