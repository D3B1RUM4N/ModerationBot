const Discord = require('discord.js')
const intents = new Discord.IntentsBitField(3276799)
const client = new Discord.Client({ intents })
//const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const config = require('./config')
//Les loader
//const loadCommands = require('./loader/loadCommands')
const loadEvents = require('./loader/loadEvents')
const loadCommands = require('./loader/loadCommands')



//client.party.activate("Happy birthday")
client.commands = new Discord.Collection()
//magenta hexa : #FF00FF
client.color = "#FF00FF";
client.function = {
    createID: require('./Functions/createID')
}




client.login(config.token)
loadEvents(client)
loadCommands(client)



console.log("\n")


