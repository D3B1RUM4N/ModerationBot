const cron = require('node-cron');
const Discord = require('discord.js');
const logs = require('./log.js');

function initScheduler(client, db) {
    // S'exécute chaque minute
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            const currentDay = now.getDay(); // 0 = Dimanche, 1 = Lundi, ..., 5 = Vendredi
            const currentHours = String(now.getHours()).padStart(2, '0');
            const currentMinutes = String(now.getMinutes()).padStart(2, '0');
            const currentTime = `${currentHours}:${currentMinutes}`;

            // Récupère les événements actifs qui correspondent au jour et à l'heure actuels
            const events = await db.scheduledEvent.findMany({
                where: {
                    dayOfWeek: currentDay,
                    cronTime: currentTime,
                    paused: false
                }
            });

            for (const event of events) {
                // 1. Calcul de l'intervalle de semaines (ex: 1 semaine sur 2)
                const diffTime = Math.abs(now.getTime() - new Date(event.anchorDate).getTime());
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                const diffWeeks = Math.floor(diffDays / 7);

                if (diffWeeks % event.intervalWeeks !== 0) {
                    continue; // Ce n'est pas la bonne semaine d'alternance
                }

                // 2. Gestion du saut de la prochaine occurrence
                if (event.skipNext) {
                    await db.scheduledEvent.update({
                        where: { eventID: event.eventID },
                        data: { skipNext: false }
                    });
                    logs.log(`[${new Date().toISOString()}]\t Événement #${event.eventID} sauté (skipNext).`);
                    continue;
                }

                // 3. Récupération du canal Discord et envoi du message
                const channel = await client.channels.fetch(event.channelID).catch(() => null);
                if (!channel) continue;

                const embed = new Discord.EmbedBuilder()
                    .setTitle(event.title)
                    .setDescription(event.description)
                    .setColor(event.color || '#FF8C00')
                    .setTimestamp();

                if (event.imageUrl) {
                    embed.setImage(event.imageUrl);
                }

                const content = event.roleID ? `<@&${event.roleID}>` : null;

                await channel.send({ content, embeds: [embed] });
                logs.log(`[${new Date().toISOString()}]\t Événement #${event.eventID} ("${event.title}") envoyé dans ${channel.name}`);
            }
        } catch (error) {
            console.error("Erreur dans EventScheduler :", error);
        }
    });
}

module.exports = { initScheduler };