const cron = require('node-cron');
const Discord = require('discord.js');
const logs = require('./log.js');

function initScheduler(client, db) {
    // S'exécute chaque minute
    cron.schedule('* * * * *', async () => {
        const now = new Date();
        const currentHours = String(now.getHours()).padStart(2, '0');
        const currentMinutes = String(now.getMinutes()).padStart(2, '0');
        const currentTime = `${currentHours}:${currentMinutes}`;
        const currentDay = now.getDay(); // 0 = Dimanche, 1 = Lundi...

        try {
            // 1. Récupération rapide des événements (Libère la connexion BDD immédiatement)
            const events = await db.scheduledEvent.findMany({
                where: {
                    cronTime: currentTime,
                    dayOfWeek: currentDay,
                    paused: false
                }
            });

            if (events.length === 0) return;

            // 2. Traitement asynchrone hors de la transaction BDD
            for (const event of events) {
                if (event.skipNext) {
                    await db.scheduledEvent.update({
                        where: { eventID: event.eventID },
                        data: { skipNext: false }
                    });
                    logs.log(`[EventScheduler] Événement #${event.eventID} sauté (skipNext).`);
                    continue;
                }

                // Vérification de la récurrence par semaine (intervalWeeks)
                if (event.intervalWeeks > 1) {
                    const anchor = new Date(event.anchorDate);
                    const diffTime = Math.abs(now - anchor);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    const diffWeeks = Math.floor(diffDays / 7);

                    if (diffWeeks % event.intervalWeeks !== 0) {
                        continue;
                    }
                }

                // Envoi Discord
                const guild = client.guilds.cache.get(event.serverID);
                if (!guild) continue;

                const channel = await client.channels.fetch(event.channelID).catch(() => null);
                if (!channel) continue;

                const embed = new Discord.EmbedBuilder()
                    .setTitle(event.title)
                    .setDescription(event.description)
                    .setColor(event.color || "#FF8C00")
                    .setTimestamp();

                if (event.imageUrl) embed.setImage(event.imageUrl);

                const content = event.roleID ? `<@&${event.roleID}>` : null;

                await channel.send({ content, embeds: [embed] });
                logs.log(`[EventScheduler] Événement #${event.eventID} ("${event.title}") envoyé sur ${guild.name}.`);
            }
        } catch (error) {
            console.error("Erreur dans EventScheduler :", error);
        }
    });
}

module.exports = { initScheduler };