const Discord = require('discord.js')

module.exports = {
    name: "help",
    description: "Affiche une aide sur les commande",
    permission: "Aucune",
    dm: true,
    category: "Utilitaire",
    options: [
        {
            type: "string",
            name: "commande",
            description: "Description de la commande",
            required: false,
            autocomplete: true
        }
    ],


    async run(client, message, args) {

        let command;
        if (args.getString("commande")) {
            command = client.commands.get(args.getString("commande"))
            if (!command) {
                console.log(args.getString("commande"))
                return message.reply("Commande invalide")
            }
        }

        if (!command) {
            let categories = [];
            client.commands.forEach(command => {
                if (!categories.includes(command.category)) categories.push(command.category)
            })

            let Embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setTitle(`Aide sur les commande`)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`Commandes Disponibles : \`${client.commands.size}\`\nCatégories disponibles : \`${categories.length}\`\n`)
                .setTimestamp()
                .setFooter({ text: "Commandes du Robot" });

            await categories.sort().forEach(async cat => {
                let commands = client.commands.filter(cmd => cmd.category === cat);
                Embed.addFields({ name: `${cat}`, value: `${commands.map(cmd => `\`${cmd.name}\` : ${cmd.description}`).join("\n")}` });
            });

            await message.reply({ embeds: [Embed] });


        } else {
            let Embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setTitle(`Aide sur la commande \`${command.name}\``)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`Nom : \`${command.name}\`\nDescription : \`${command.description}\`\nPermission : \`${typeof command.permission !== "bigint" ? command.permission : new Discord.PermissionsBitField(command.permission).toArray(false)}\`\nDM : \`${command.dm ? "oui" : "non"}\`\nCatégorie : \`${command.category}\`\n`)
                .setTimestamp()
                .setFooter({ text: "Commandes du Robot" });
            await message.reply({ embeds: [Embed] });
        }
    }
}