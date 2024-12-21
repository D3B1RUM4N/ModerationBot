const schedule = require('node-schedule');

module.exports = (client) => {
    const channelID = '1303720668881358991'; // ID du canal où le message sera envoyé



    console.log('Le bot est en ligne !');

    // Définir la règle pour planifier l'envoi du message
    const rule = new schedule.RecurrenceRule();
    rule.tz = 'Europe/Paris'; // Définir le fuseau horaire pour éviter les problèmes liés à l'heure d'été / d'hiver
    rule.hour = 20; // Définir l'heure
    rule.minute = 0; // Définir les minutes

    // Planifier l'envoi du message
    schedule.scheduleJob(rule, () => {
        const channel = client.channels.cache.get(channelID);
        if (channel) {
            const randomPhrase = phrase[Math.floor(Math.random() * phrase.length)];
            channel.send(`${randomPhrase} @everyone`);
        } else {
            console.error(`Impossible de trouver le salon d'ID ${channelID} pour envoyer le message !`);
        }
    });
}

const phrase = [
    "# ARBEIT MACHT FREI \n \t-Auschwitz",
    "# Travail, Famille, Patrie \n \t-Pétain",
    "# Труд освобождает\n",
    "# Du travail pour tous, une place pour chacun\n \t-Pétain",
    "# Patria o muerte, venceremos\n \t-Fidel Castro et Che Guevara",
    "# Ein Volk, ein Reich, ein Führer\n \t-Hitler",
    "# Mourir est facile, c\’est vivre en esclave qui est difficile\n",
    "# Il Duce ha sempre ragione\n \t-Mussolini",
]