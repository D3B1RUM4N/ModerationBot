const Discord = require('discord.js');

// Description par catégorie (dossier)
const categoryDescriptions = {
    "Administration": "Commandes de gestion et modération du serveur",
    "Utilitaire": "Outils pratiques et informations générales",
    "Information": "Commandes d'information relatives au bot ou au serveur",
    "Event": "Gestion des événements récurrents (BK, réunions...)"
};

module.exports = {
    name: "help",
    description: "Affiche l'aide des commandes ou des catégories",
    permission: "Aucune",
    dm: true,
    category: "Utilitaire",
    options: [
        {
            type: "string",
            name: "commande",
            description: "Nom d'une commande spécifique",
            required: false,
            autocomplete: true
        },
        {
            type: "string",
            name: "categorie",
            description: "Nom d'une catégorie complète",
            required: false,
            autocomplete: true
        }
    ],

    async run(client, message, args) {
        const cmdArg = args.getString("commande");
        const catArg = args.getString("categorie");

        // --- CAS 1 : Recherche d'une COMMANDE spécifique ---
        if (cmdArg) {
            const command = client.commands.get(cmdArg.toLowerCase());

            if (!command) {
                return message.reply({ content: `⚠️ La commande \`${cmdArg}\` est introuvable.`, ephemeral: true });
            }

            let embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setTitle(`🔍 Commande \`/${command.name}\``)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`**Nom :** \`${command.name}\`\n**Description :** ${command.description}\n**Catégorie :** \`${command.category}\`\n**DM :** \`${command.dm ? "oui" : "non"}\``)
                .setTimestamp()
                .setFooter({ text: "Commandes du Robot" });

            if (command.options && command.options.length > 0) {
                const actionOption = command.options.find(opt => opt.name === "action");

                if (actionOption && actionOption.choices) {
                    const actionsList = actionOption.choices
                        .map(c => `• \`${c.value}\` : ${c.name}`)
                        .join("\n");
                    embed.addFields({ name: "⚡ Actions disponibles", value: actionsList });
                }

                const optionsList = command.options
                    .map(opt => `• \`${opt.name}\` (${opt.type}) : ${opt.description}${opt.required ? " *(requis)*" : ""}`)
                    .join("\n");

                embed.addFields({ name: "⚙️ Options paramétrables", value: optionsList });
            }

            return message.reply({ embeds: [embed] });
        }

        // --- CAS 2 : Recherche d'une CATÉGORIE spécifique ---
        if (catArg) {
            const categories = [...new Set(client.commands.map(cmd => cmd.category))];
            const categoryMatch = categories.find(cat => cat.toLowerCase() === catArg.toLowerCase());

            if (!categoryMatch) {
                return message.reply({ content: `⚠️ La catégorie \`${catArg}\` est introuvable.`, ephemeral: true });
            }

            const commandsInCat = client.commands.filter(cmd => cmd.category === categoryMatch);
            const catDesc = categoryDescriptions[categoryMatch] || "Aucune description disponible";

            let embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setTitle(`📁 Catégorie : ${categoryMatch}`)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`*${catDesc}*\n\n**Commandes (${commandsInCat.size}) :**`)
                .setTimestamp()
                .setFooter({ text: "Commandes du Robot" });

            commandsInCat.forEach(cmd => {
                embed.addFields({
                    name: `\`/${cmd.name}\``,
                    value: cmd.description || "Pas de description"
                });
            });

            return message.reply({ embeds: [embed] });
        }

        // --- CAS 3 : Aucun argument -> Liste des catégories ---
        let categories = [];
        client.commands.forEach(cmd => {
            if (cmd.category && !categories.includes(cmd.category)) {
                categories.push(cmd.category);
            }
        });

        let embed = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setTitle(`📚 Liste des catégories`)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`Il y a **${categories.length}** catégories et **${client.commands.size}** commandes au total.\n\nUtilise l'option \`commande\` ou \`categorie\` pour filtrer.`)
            .setTimestamp()
            .setFooter({ text: "Commandes du Robot" });

        categories.sort().forEach(cat => {
            const desc = categoryDescriptions[cat] || "Aucune description disponible";
            const count = client.commands.filter(cmd => cmd.category === cat).size;
            embed.addFields({
                name: `📁 ${cat} (${count} commande${count > 1 ? 's' : ''})`,
                value: desc
            });
        });

        return message.reply({ embeds: [embed] });
    }
};