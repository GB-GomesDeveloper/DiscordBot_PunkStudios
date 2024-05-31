const fs = require('fs');
const config = require('../Security/SlashCommands/config');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Token_Bot } = require("../Security/Config/informacoes")
module.exports = async (client) => {
	const clientId = config.general.clientid;

	client.handleCommands = async (commandFolders, path) => {
		client.commandArray = [];
		for (folder of commandFolders) {
			const commandFiles = fs
				.readdirSync(`${path}/${folder}`)
				.filter((file) => file.endsWith('.js'));
			for (const file of commandFiles) {
				const command = require(`../src/${folder}/${file}`);
				client.commands.set(command.data.name, command);
				client.commandArray.push(command.data.toJSON());
			}
		}

		const rest = new REST({ version: '9' }).setToken(Token_Bot);

		(async () => {
			try {
				console.log('Aplicação Iniciada ! (/) commands');

				await rest.put(Routes.applicationCommands(clientId), {
					body: client.commandArray,
				});

				console.log('Aplicação recarregada com sucesso ! (/) commands');
			} catch (error) {
				console.log(`${error}`);
			}
		})();
	};
};