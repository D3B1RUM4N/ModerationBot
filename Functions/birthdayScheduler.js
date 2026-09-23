const cron = require('node-cron');
const Discord = require('discord.js');
const logs = require('./log.js');

// Cache en mémoire des anniversaires du jour
let todayBirthdays = [];

/**
 * Recharche la liste des anniversaires du jour depuis la BDD
 */
async function loadTodayBirthdays(db) {
    try {
        const now = new Date();
        const currentDay = now.getDate();
        const currentMonth = now.getMonth() + 1; // JS les mois vont de 0 à 11

        todayBirthdays = await db.userBirthday.findMany({
            where: {
                day: currentDay,
                month: currentMonth
            }
        });

        logs.log(`[Birthday Cache] ${todayBirthdays.length} anniversaire(s) chargé(s) pour aujourd'hui (${currentDay}/${currentMonth}).`);
    } catch (error) {
        console.error("Erreur lors du chargement du cache d'anniversaires :", error);
    }
}

/**
 * Permet d'injecter un anniversaire en cache à la volée (si saisie le jour même)
 */
function addBirthdayToCache(userID, day, month) {
    const now = new Date();
    if (day === now.getDate() && month === (now.getMonth() + 1)) {
        if (!todayBirthdays.some(u => u.userID === userID)) {
            todayBirthdays.push({ userID, day, month });
        }
    }
}

/**
 * Initialise le planificateur
 */
function initBirthdayScheduler(client, db) {
    // 1. Chargement initial au démarrage du bot
    loadTodayBirthdays(db);

    // 2. Rechargement automatique chaque jour à 00:01
    cron.schedule('1 0 * * *', () => {
        loadTodayBirthdays(db);
    });

    // 3. Vérification uniquement à chaque heure pile (ex: 08:00, 09:00, 10:00...)
    cron.schedule('0 * * * *', async () => {
        if (todayBirthdays.length === 0) return;

        const now = new Date();
        const currentHours = String(now.getHours()).padStart(2, '0');
        const currentTime = `${currentHours}:00`;

        try {
            // Récupère les serveurs où la fonctionnalité est active pour cette heure
            const activeConfigs = await db.serverBirthdayConfig.findMany({
                where: {
                    enabled: true,
                    birthdayTime: currentTime
                }
            });

            for (const config of activeConfigs) {
                if (!config.channelID) continue;

                const guild = client.guilds.cache.get(config.serverID);
                if (!guild) continue;

                const channel = await client.channels.fetch(config.channelID).catch(() => null);
                if (!channel) continue;

                for (const bday of todayBirthdays) {
                    // Vérifie si le membre fait partie du serveur
                    const member = await guild.members.fetch(bday.userID).catch(() => null);
                    if (!member) continue;

                    // Construction du message / Embed
                    const defaultMsg = `🎂 Aujourd'hui c'est l'anniversaire de <@${member.id}> ! Bon anniversaire ! 🎉`;
                    const customMessage = config.birthdayMessage
                        ? config.birthdayMessage.replace('{user}', `<@${member.id}>`)
                        : defaultMsg;

                    const embed = new Discord.EmbedBuilder()
                        .setTitle("🎉 Joyeux Anniversaire !")
                        .setDescription(customMessage)
                        .setColor(client.color || "#FF00FF")
                        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                        .setTimestamp();

                    const content = config.roleID ? `<@&${config.roleID}>` : null;

                    await channel.send({ content, embeds: [embed] });
                    logs.log(`[Birthday] Anniversaire de ${member.user.tag} fêté sur ${guild.name}`);
                }
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi des anniversaires :", error);
        }
    });
}

module.exports = { initBirthdayScheduler, addBirthdayToCache };