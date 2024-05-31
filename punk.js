const {Client, IntentsBitField, Collection} = require("discord.js");
const client = new Client({intents: [IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.DirectMessages]});
const { Token_Bot } = require("./Security/Config/informacoes")
const fs = require("fs")
client.login(Token_Bot);

client.commands = new Collection();

const functions = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));
const eventsFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const commandFolders = fs.readdirSync('./src');

(async () => {
	for (file of functions) {
		require(`./functions/${file}`)(client);
	}

	client.handleEvents(eventsFiles, './events');
	client.handleCommands(commandFolders, './src');
})();

