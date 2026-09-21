const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');

module.exports = async client => {
    let commands = [];

    client.commands.forEach(command => {
        let slashcommand = new Discord.SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description)
            .setDMPermission(command.dm)
            .setDefaultMemberPermissions(command.permission === "Aucune" ? null : command.permission);

        if (command.options && command.options.length >= 1) {
            for (let i = 0; i < command.options.length; i++) {
                const opt = command.options[i];
                const typeFormatted = opt.type.slice(0, 1).toUpperCase() + opt.type.slice(1);
                const methodName = `add${typeFormatted}Option`;

                if (typeof slashcommand[methodName] === 'function') {
                    slashcommand[methodName](option => {
                        option.setName(opt.name)
                            .setDescription(opt.description)
                            .setRequired(opt.required || false);

                        // Gestion de l'autocomplétion (uniquement si explicitement défini)
                        if (opt.autocomplete !== undefined && typeof option.setAutocomplete === 'function') {
                            option.setAutocomplete(opt.autocomplete);
                        }

                        // Gestion des choix (choices) pour string / integer
                        if (opt.choices && opt.choices.length > 0 && typeof option.addChoices === 'function') {
                            option.addChoices(...opt.choices);
                        }

                        return option;
                    });
                }
            }
        }
        commands.push(slashcommand);
    });

    const rest = new REST({ version: '10' }).setToken(client.token || process.env.TOKEN);

    try {
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log("Slash commands chargées avec succès !");
    } catch (error) {
        console.error("Erreur lors du chargement des slash commands :", error);
    }
};