const cron = require('node-cron');
const Discord = require('discord.js');
const logs = require('./log.js');

let todayBirthdays = [];

async function loadTodayBirthdays(db) {
    try {
        const now = new Date();
        const currentDay = now.getDate();
        const currentMonth = now.getMonth() + 1;

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

function addBirthdayToCache(userID, day, month) {
    const now = new Date();
    if (day === now.getDate() && month === (now.getMonth() + 1)) {
        if (!todayBirthdays.some(u => u.userID === userID)) {
            todayBirthdays.push({ userID, day, month });
        }
    }
}

function initBirthdayScheduler(client, db) {
    loadTodayBirthdays(db);

    cron.schedule('1 0 * * *', () => {
        loadTodayBirthdays(db);
    });

    cron.schedule('0 * * * *', async () => {
        if (todayBirthdays.length === 0) return;

        const now = new Date();
        const currentHours = String(now.getHours()).padStart(2, '0');
        const currentTime = `${currentHours}:00`;

        try {
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
                    const member = await guild.members.fetch(bday.userID).catch(() => null);
                    if (!member) continue;

                    // Création de la description avec le saut de ligne
                    let embedDescription = `Aujourd'hui c'est l'anniversaire à ${member} !`;
                    if (config.birthdayMessage) {
                        const customPart = config.birthdayMessage.replace(/{user}/g, `${member}`);
                        embedDescription += `\n\n${customPart}`;
                    }

                    const embed = new Discord.EmbedBuilder()
                        .setTitle(`🎉 Joyeux anniversaire ${member.user.username}`)
                        .setDescription(embedDescription)
                        .setColor(client.color || "#FF00FF")
                        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                        .setTimestamp();

                    let content = null;
                    if (config.roleID) {
                        if (config.roleID === guild.id || (guild.roles.everyone && config.roleID === guild.roles.everyone.id)) {
                            content = "@everyone";
                        } else {
                            content = `<@&${config.roleID}>`;
                        }
                    }

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