const Discord = require('discord.js')
const intents = new Discord.IntentsBitField(3276799)
const client = new Discord.Client({ intents })
//const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const config = require('./config')
//Les loader
//const loadCommands = require('./loader/loadCommands')
const loadEvents = require('./loader/loadEvents')
const loadCommands = require('./loader/loadCommands')
const stupid = require('./stupid')



//client.party.activate("Happy birthday")
client.commands = new Discord.Collection()
//magenta hexa : #FF00FF
client.color = "#FF00FF";
client.function = {
    createID: require('./Functions/createID')
}

const lienRegex = /https?:\/\/\S+/;
//les reponses stupides
client.on('messageCreate', message => {
    if (message.author.bot) return
    if (message.content.startsWith("/")) return
    if (lienRegex.test(message.content)) return
    //redirigé vers le fichier stupid.js
    stupid(message)
})

// client.on('guildCreate', (guild) => {
//     console.log(`Le bot a rejoint le serveur : ${guild.name} (ID: ${guild.id})`);
//     // Vous pouvez ajouter ici des actions supplémentaires à effectuer lorsque le bot rejoint un serveur
// });


client.login(config.token)
loadEvents(client)
loadCommands(client)



console.log("\n")


