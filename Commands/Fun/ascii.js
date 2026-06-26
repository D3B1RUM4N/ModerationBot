const Discord = require('discord.js');
const figlet = require('figlet');

module.exports = {
    name: "ascii",
    description: "Convert text to ASCII art",
    permission: "Aucune",
    dm: false,
    category: "fun",

    options: [
        {
            type: "string",
            name: "text",
            description: "Text à convertir en ASCII art",
            required: true,
            autocomplete: false
        }
    ],

    async run(client, message, args) {
        const msg = message.options.getString('text');

        if (msg.length > 2000) return client.errNormal({ error: "Fournis un texte inferieur a 2000 caracteres!", type: 'editreply' }, message);
        let embed = new Discord.EmbedBuilder()

        await figlet.text(msg, function (err, data) {

            if (err) {

                return message.reply("Une erreur est survenue !");
            }

            embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setTitle(`💬・Ascii`)
                .setDescription(`\`\`\`${data}\`\`\``)
                .setFooter({ text: `${message.user.username}`, iconURL: message.user.displayAvatarURL({ dynamic: true }) })

        })
        await message.reply({ embeds: [embed] });
    }

}