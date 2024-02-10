const Discord = require('discord.js')
const logs  = require('../Functions/log')
const config = require('../config.js')


module.exports = {
    name: "disconnect",
    description: "Deconnecte le bot (reservé au propriétaire)",
    permission : "Aucune",
    dm : false,
    category : "Owner",  

    async run(client, message) {
        // ID de la personne autorisée
        const personneAutoriseeID = config.ownerID;

        // Vérifie si l'auteur de la commande est la personne autorisée
        if (message.user.id != personneAutoriseeID) {
            // Répondre si l'auteur n'est pas autorisé
            return message.reply('Vous n\'êtes pas autorisé à exécuter cette commande.');
        }

        await message.reply(`bot déconnecté`)
        logs.log(`[${new Date().toISOString()}]\t ${message.user.tag} a envoyé "${message}" dans le canal ${message.channel.name}`);
        logs.log("Bot déconnecté\n\n\n\n");
        client.destroy()
    }
}