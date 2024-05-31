const { CommandInteraction, Client, ChannelType, PermissionsBitField, ButtonStyle, ActionRowBuilder, TextInputStyle, TextInputBuilder, PermissionFlagsBits, ModalBuilder, EmbedBuilder, ButtonBuilder} = require("discord.js")
const { createTranscript } = require("discord-html-transcripts")
const { hostdb, userdb, passwordDB, databasedb, charsetdb } = require("../util/dbBase_dados_Ready")
const mysql = require('mysql2');
module.exports = {
	name: 'interactionCreate',

	/**
	 * @param {CommandInteraction} interaction 
	 * @param {Client} client 
	 */
	async execute(interaction, client) {
		if (!interaction.guild || interaction.user.bot) return;


		if (interaction.isCommand()) {

			const command = client.commands.get(interaction.commandName);
			if (!command) return;

			try {
				await command.execute(client, interaction);
			} catch (error) {
				console.log(error);
			}
		}
		// 

		let connection
		function DbConnectReady() {
			connection = new mysql.createConnection({
				host: hostdb,
				user: userdb,
				password: passwordDB,
				database: "punk_studios_tickets",
				charset: charsetdb
			})
			connection.connect(function (err) {
				if (err) {
					console.log(`Erro ao conectar na database, proteção ${err}`);
					setTimeout(connection, 2000);
				}
			});

			connection.on('error', function (err) {
				console.log('database erro RESET...');
				if (err.code === 'PROTOCOL_CONNECTION_LOST') {
					return
				} else {
					// throw err;                                  
				}
			});
		}
		DbConnectReady()

		if (interaction.isStringSelectMenu()) {


			const value = interaction.values[0];
			//  Suporte
			if (value == "Suporte") {
				connection.query(`SELECT * FROM tickets WHERE  id_discord = "${interaction.user.id}"`, (err, result) => {
					if (err) {
						return interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
					} else if (result) {

						if (result[0]) {
							let embed = new EmbedBuilder()
								.setDescription(`**❌ | ${interaction.user}, Você já tem um ticket com a categoria ** *${result[0].categoria}* ** aberta. Não será possivel criar outro ticket ! **`)
								.setColor("Red");
							return interaction.reply({ embeds: [embed], ephemeral: true });
						}
						const channelCreate = interaction.guild.channels.create({
							name: `【𝙎𝙪𝙥𝙤𝙧𝙩𝙚】・${interaction.user.tag}`,
							type: ChannelType.GuildText,
							parent: "945011737739010048",
							permissionOverwrites: [
								{
									id: interaction.guild.roles.everyone.id,
									deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
								},

								{
									id: interaction.user.id,
									allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
								}
							]
						})
						channelCreate.then(channelid => {
							connection.query(`INSERT INTO tickets (nome, id_discord, categoria, channel) VALUES ("${interaction.user.username}","${interaction.user.id}","suporte", "${channelid.id}")`, (err, result) => {
								if (err) {
									return interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
								} else if (result) {
									channelCreate.then(msg => {

										let embedS = new EmbedBuilder()
											.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
											.setTitle("Suporte !")
											.setDescription(`**🌟 | ${interaction.user}, seja bem vindo ao seu ticket.**  *Aguarde os donos responder !*
	  
		⚠ | *Evite de ser banido ou castigado. Leiam as ${client.channels.cache.get("756261165008551977")} para isso não acontecer !*

		`)
											.setColor("Red")
											.setTimestamp()
											.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
											.setURL("https://github.com/ItaChiGabriel")
											.setFooter({ text: `${interaction.guild.name} ~ Copyright © ${new Date().getFullYear()} / Todos os direitos reservados / ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })

										let row = new ActionRowBuilder()
											.addComponents(
												new ButtonBuilder()
													.setCustomId("SairTicket")
													// .setEmoji("🚪")
													.setStyle(ButtonStyle.Success)
													.setLabel("🚪Sair"),

												new ButtonBuilder()
													.setURL("https://punkstudios.com.br")
													// .setEmoji("🌍")
													.setStyle(ButtonStyle.Link)
													.setLabel("🌍Nosso Site"),

												new ButtonBuilder()
													.setCustomId("AddMember")
													.setLabel("🫂 Adicionar Membro")
													.setStyle(ButtonStyle.Secondary),

												new ButtonBuilder()
													.setCustomId("RmMember")
													.setLabel("🤢 Remover Membro")
													.setStyle(ButtonStyle.Danger)
											)

										let ticketCreate = new EmbedBuilder()
											.setDescription(`**✔️ | ${interaction.user}, seu ticket foi criado. Click no botão abaixo para ser redirecionado !**`)
											.setColor("Red")

										const rowCreateTicket = new ActionRowBuilder()
											.addComponents(
												new ButtonBuilder()
													.setURL(`https://discord.com/channels/677696861636657153/${msg.id}`)
													.setStyle(ButtonStyle.Link)
													.setLabel(`🔗 ${msg.name}`)
											)

										interaction.reply({ embeds: [ticketCreate], components: [rowCreateTicket], ephemeral: true })

										msg.send({ embeds: [embedS], components: [row] })

									})
								}
							})
						})
					}

				})


			}
			if (value == "Ecomenda de Scripts") {
				connection.query(`SELECT * FROM tickets WHERE  id_discord = "${interaction.user.id}"`, (err, result) => {
					if (err) {
						interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
					} else if (result) {

						if (result[0]) {
							let embed = new EmbedBuilder()
								.setDescription(`**❌ | ${interaction.user}, Você já tem um ticket com a categoria ** *${result[0].categoria}* ** aberta. Não será possivel criar outro ticket ! **`)
								.setColor("Red");

							return interaction.reply({ embeds: [embed], ephemeral: true });
						}



						const channelCreate = interaction.guild.channels.create({
							name: `【𝙀𝙣𝙘𝙤𝙢𝙚𝙣𝙙𝙖 𝙙𝙚 𝙎𝙘𝙧𝙞𝙥𝙩𝙨】・${interaction.user.tag}`,
							type: ChannelType.GuildText,
							parent: "945011737739010048",
							permissionOverwrites: [


								{
									id: interaction.guild.roles.everyone.id,
									deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
								},

								{
									id: interaction.user.id,
									allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
								}
							]
						})

						channelCreate.then(channelid => {

							connection.query(`INSERT INTO tickets (nome, id_discord, categoria, channel) VALUES ("${interaction.user.username}","${interaction.user.id}","Encomendas de Scripts", "${channelid.id}")`, (err, result) => {
								if (err) {
									return interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
								} else if (result) {
									channelCreate.then(msg => {

										let embedT = new EmbedBuilder()
											.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
											.setTitle("Encomendas de Scripts !")
											.setDescription(`**🌟 | ${interaction.user}, seja bem vindo ao seu ticket.** *Aguarde o ${client.users.cache.get("351875751571750923")} responder, em quanto isso você pode dar detalhes sobre a encomenda.*
		
		  ⚠ | *Evite de ser banido ou castigado. Leiam as ${client.channels.cache.get("756261165008551977")} para isso não acontecer !*
  
		  `)
											.setColor("Red")
											.setTimestamp()
											.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
											.setURL("https://github.com/ItaChiGabriel")
											.setFooter({ text: `${interaction.guild.name} ~ Copyright © ${new Date().getFullYear()} / Todos os direitos reservados / ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })

										let row = new ActionRowBuilder()
											.addComponents(
												new ButtonBuilder()
													.setCustomId("SairTicket")
													// .setEmoji("🚪")
													.setStyle(ButtonStyle.Success)
													.setLabel("🚪Sair"),

												new ButtonBuilder()
													.setURL("https://punkstudios.com.br")
													// .setEmoji("🌍")
													.setStyle(ButtonStyle.Link)
													.setLabel("🌍Nosso Site"),

												new ButtonBuilder()
													.setCustomId("AddMember")
													.setLabel("🫂 Adicionar Membro")
													.setStyle(ButtonStyle.Secondary),

												new ButtonBuilder()
													.setCustomId("RmMember")
													.setLabel("🤢 Remover Membro")
													.setStyle(ButtonStyle.Danger)

											)


										let ticketCreate = new EmbedBuilder()
											.setDescription(`**✔️ | ${interaction.user}, seu ticket foi criado. Click no botão abaixo para ser redirecionado !**`)
											.setColor("Red")

										const rowCreateTicket = new ActionRowBuilder()
											.addComponents(
												new ButtonBuilder()
													.setURL(`https://discord.com/channels/677696861636657153/${msg.id}`)
													.setStyle(ButtonStyle.Link)
													.setLabel(`🔗 ${msg.name}`)
											)

										interaction.reply({ embeds: [ticketCreate], components: [rowCreateTicket], ephemeral: true })

										msg.send({ embeds: [embedT], components: [row] })


									})
								}
							})
						})
					}
				})
			}
			if (value == "Orçamento de Site") {
				connection.query(`SELECT * FROM tickets WHERE  id_discord = "${interaction.user.id}"`, (err, result) => {
					if (err) {
						return interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
					} else if (result) {

						if (result[0]) {
							let embed = new EmbedBuilder()
								.setDescription(`**❌ | ${interaction.user}, Você já tem um ticket com a categoria ** *${result[0].categoria}* ** aberta. Não será possivel criar outro ticket ! **`)
								.setColor("Red");

							return interaction.reply({ embeds: [embed], ephemeral: true });
						}

						const channelCreate = interaction.guild.channels.create({
							name: `【𝙊𝙧𝙘̧𝙖𝙢𝙚𝙣𝙩𝙤 𝙙𝙚 𝙎𝙞𝙩𝙚𝙨】・${interaction.user.tag}`,
							type: ChannelType.GuildText,
							parent: "945011737739010048",
							permissionOverwrites: [


								{
									id: interaction.guild.roles.everyone.id,
									deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
								},

								{
									id: interaction.user.id,
									allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
								}
							]
						})
						channelCreate.then(channelid => {
							connection.query(`INSERT INTO tickets (nome, id_discord, categoria, channel) VALUES ("${interaction.user.username}","${interaction.user.id}","Orçamento de Site", "${channelid.id}")`, (err, result) => {
								if (err) {
									interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
								} else if (result) {
									channelCreate.then(msg => {

										let embedT = new EmbedBuilder()
											.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
											.setTitle("Orçamento de Site !")
											.setDescription(`**🌟 | ${interaction.user}, seja bem vindo ao seu ticket.** *Aguarde o ${client.users.cache.get("704425386007724034")} responder, em quanto isso você pode comentar como quer o site.*
		
		  ⚠ | *Evite de ser banido ou castigado. Leiam as ${client.channels.cache.get("756261165008551977")} para isso não acontecer !*
  
		  `)
											.setColor("Red")
											.setTimestamp()
											.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
											.setURL("https://github.com/ItaChiGabriel")
											.setFooter({ text: `${interaction.guild.name} ~ Copyright © ${new Date().getFullYear()} / Todos os direitos reservados / ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })

										let row = new ActionRowBuilder()
											.addComponents(
												new ButtonBuilder()
													.setCustomId("SairTicket")
													// .setEmoji("🚪")
													.setStyle(ButtonStyle.Success)
													.setLabel("🚪Sair"),

												new ButtonBuilder()
													.setURL("https://punkstudios.com.br")
													// .setEmoji("🌍")
													.setStyle(ButtonStyle.Link)
													.setLabel("🌍Nosso Site"),


												new ButtonBuilder()
													.setCustomId("AddMember")
													.setLabel("🫂 Adicionar Membro")
													.setStyle(ButtonStyle.Secondary),

												new ButtonBuilder()
													.setCustomId("RmMember")
													.setLabel("🤢 Remover Membro")
													.setStyle(ButtonStyle.Danger)

											)


										let ticketCreate = new EmbedBuilder()
											.setDescription(`**✔️ | ${interaction.user}, seu ticket foi criado. Click no botão abaixo para ser redirecionado !**`)
											.setColor("Red")

										const rowCreateTicket = new ActionRowBuilder()
											.addComponents(
												new ButtonBuilder()
													.setURL(`https://discord.com/channels/677696861636657153/${msg.id}`)
													.setStyle(ButtonStyle.Link)
													.setLabel(`🔗 ${msg.name}`)
											)

										interaction.reply({ embeds: [ticketCreate], components: [rowCreateTicket], ephemeral: true })

										msg.send({ embeds: [embedT], components: [row] })


									})
								}
							})
						})
					}
				})
			}
			if (value == "Dúvidas") {
				connection.query(`SELECT * FROM tickets WHERE  id_discord = "${interaction.user.id}"`, (err, result) => {
					if (err) {
						return interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
					} else if (result) {

						if (result[0]) {
							let embed = new EmbedBuilder()
								.setDescription(`**❌ | ${interaction.user}, Você já tem um ticket com a categoria ** *${result[0].categoria}* ** aberta. Não será possivel criar outro ticket ! **`)
								.setColor("Red");

							return interaction.reply({ embeds: [embed], ephemeral: true });
						}


						const channelCreate = interaction.guild.channels.create({
							name: `【𝘿𝙪𝙫𝙞𝙙𝙖𝙨】・${interaction.user.tag}`,
							type: ChannelType.GuildText,
							parent: "945011737739010048",
							permissionOverwrites: [


								{
									id: interaction.guild.roles.everyone.id,
									deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
								},

								{
									id: interaction.user.id,
									allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
								}
							]
						})
						channelCreate.then(channelid => {
							connection.query(`INSERT INTO tickets (nome, id_discord, categoria, channel) VALUES ("${interaction.user.username}","${interaction.user.id}","Dúvidas", "${channelid.id}")`, (err, result) => {
								if (err) {
									interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
								} else if (result) {
									channelCreate.then(async msg => {

										let embedT = new EmbedBuilder()
											.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
											.setTitle("Dúvidas !")
											.setDescription(`**🌟 | ${interaction.user}, seja bem vindo ao seu ticket.** *Diga-nos qual é sual dúvida ?*
			
			  ⚠ | *Evite de ser banido ou castigado. Leiam as ${client.channels.cache.get("756261165008551977")} para isso não acontecer !*
	  
			  `)
											.setColor("Red")
											.setTimestamp()
											.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
											.setURL("https://github.com/ItaChiGabriel")
											.setFooter({ text: `${interaction.guild.name} ~ Copyright © ${new Date().getFullYear()} / Todos os direitos reservados / ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })

										let row = new ActionRowBuilder()
											.addComponents(
												new ButtonBuilder()
													.setCustomId("SairTicket")
													// .setEmoji("🚪")
													.setStyle(ButtonStyle.Success)
													.setLabel("🚪Sair"),

												new ButtonBuilder()
													.setURL("https://punkstudios.com.br")
													// .setEmoji("🌍")
													.setStyle(ButtonStyle.Link)
													.setLabel("🌍Nosso Site"),

												new ButtonBuilder()
													.setCustomId("AddMember")
													.setLabel("🫂 Adicionar Membro")
													.setStyle(ButtonStyle.Secondary),

												new ButtonBuilder()
													.setCustomId("RmMember")
													.setLabel("🤢 Remover Membro")
													.setStyle(ButtonStyle.Danger)
											)


										let ticketCreate = new EmbedBuilder()
											.setDescription(`**✔️ | ${interaction.user}, seu ticket foi criado. Click no botão abaixo para ser redirecionado !**`)
											.setColor("Red")

										const rowCreateTicket = new ActionRowBuilder()
											.addComponents(
												new ButtonBuilder()
													.setURL(`https://discord.com/channels/677696861636657153/${msg.id}`)
													.setStyle(ButtonStyle.Link)
													.setLabel(`🔗 ${msg.name}`)
											)

										interaction.reply({ embeds: [ticketCreate], components: [rowCreateTicket], ephemeral: true })

										msg.send({ embeds: [embedT], components: [row] })


									})
								}
							})
						})
					}
				})
			}
			if (value == "Reportar Bug") {
				connection.query(`SELECT * FROM tickets WHERE  id_discord = "${interaction.user.id}"`, (err, result) => {
					if (err) {
						return interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
					} else if (result) {

						if (result[0]) {
							let embed = new EmbedBuilder()
								.setDescription(`**❌ | ${interaction.user}, Você já tem um ticket com a categoria ** *${result[0].categoria}* ** aberta. Não será possivel criar outro ticket ! **`)
								.setColor("Red");

							return interaction.reply({ embeds: [embed], ephemeral: true });
						}



						const channelCreate = interaction.guild.channels.create({
							name: `【𝙍𝙚𝙥𝙤𝙧𝙩𝙖𝙧 𝘽𝙪𝙜】・${interaction.user.tag}`,
							type: ChannelType.GuildText,
							parent: "945011737739010048",
							permissionOverwrites: [


								{
									id: interaction.guild.roles.everyone.id,
									deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
								},

								{
									id: interaction.user.id,
									allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
								}
							]
						})
						channelCreate.then(channelid => {
							connection.query(`INSERT INTO tickets (nome, id_discord, categoria, channel) VALUES ("${interaction.user.username}","${interaction.user.id}","Reportar Bug", "${channelid.id}")`, (err, result) => {
								if (err) {
									interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
								} else if (result) {
									channelCreate.then(msg => {

										let embedT = new EmbedBuilder()
											.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
											.setTitle("Reportar Bug !")
											.setDescription(`**🌟 | ${interaction.user}, seja bem vindo ao seu ticket.** *Diga-nos o que aconteceu ?*
	  
		⚠ | *Evite de ser banido ou castigado. Leiam as ${client.channels.cache.get("756261165008551977")} para isso não acontecer !*

		`)
											.setColor("Red")
											.setTimestamp()
											.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
											.setURL("https://github.com/ItaChiGabriel")
											.setFooter({ text: `${interaction.guild.name} ~ Copyright © ${new Date().getFullYear()} / Todos os direitos reservados / ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })

										let row = new ActionRowBuilder()
											.addComponents(
												new ButtonBuilder()
													.setCustomId("SairTicket")
													// .setEmoji("🚪")
													.setStyle(ButtonStyle.Success)
													.setLabel("🚪Sair"),

												new ButtonBuilder()
													.setURL("https://punkstudios.com.br")
													// .setEmoji("🌍")
													.setStyle(ButtonStyle.Link)
													.setLabel("🌍Nosso Site"),


												new ButtonBuilder()
													.setCustomId("AddMember")
													.setLabel("🫂 Adicionar Membro")
													.setStyle(ButtonStyle.Secondary),

												new ButtonBuilder()
													.setCustomId("RmMember")
													.setLabel("🤢 Remover Membro")
													.setStyle(ButtonStyle.Danger)

											)

										let ticketCreate = new EmbedBuilder()
											.setDescription(`**✔️ | ${interaction.user}, seu ticket foi criado. Click no botão abaixo para ser redirecionado !**`)
											.setColor("Red")

										const rowCreateTicket = new ActionRowBuilder()
											.addComponents(
												new ButtonBuilder()
													.setURL(`https://discord.com/channels/677696861636657153/${msg.id}`)
													.setStyle(ButtonStyle.Link)
													.setLabel(`🔗 ${msg.name}`)
											)

										interaction.reply({ embeds: [ticketCreate], components: [rowCreateTicket], ephemeral: true })

										msg.send({ embeds: [embedT], components: [row] })


									})
								}
							})
						})

					}
				})
			}
			if (value == "Orçamendo de Bots") {
				connection.query(`SELECT * FROM tickets WHERE  id_discord = "${interaction.user.id}"`, (err, result) => {
					if (err) {
						return interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
					} else if (result) {

						if (result[0]) {
							let embed = new EmbedBuilder()
								.setDescription(`**❌ | ${interaction.user}, Você já tem um ticket com a categoria ** *${result[0].categoria}* ** aberta. Não será possivel criar outro ticket ! **`)
								.setColor("Red");

							return interaction.reply({ embeds: [embed], ephemeral: true });
						}



						const channelCreate = interaction.guild.channels.create({
							name: `【𝙊𝙧𝙘̧𝙖𝙢𝙚𝙣𝙙𝙤 𝙙𝙚 𝘽𝙤𝙩𝙨】・${interaction.user.tag}`,
							type: ChannelType.GuildText,
							parent: "945011737739010048",
							permissionOverwrites: [


								{
									id: interaction.guild.roles.everyone.id,
									deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
								},

								{
									id: interaction.user.id,
									allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
								}
							]
						})
						channelCreate.then(channelid => {
							connection.query(`INSERT INTO tickets (nome, id_discord, categoria, channel) VALUES ("${interaction.user.username}","${interaction.user.id}","Orçamendo de Bots", "${channelid.id}")`, (err, result) => {
								if (err) {
									interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
								} else if (result) {
									channelCreate.then(msg => {

										let embedT = new EmbedBuilder()
											.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
											.setTitle("Orçamendo de Bots !")
											.setDescription(`**🌟 | ${interaction.user}, seja bem vindo ao seu ticket.** *Aguarde o ${client.users.cache.get("704425386007724034")} responder, em quanto isso você pode comentar como quer o bot!*
	  
		⚠ | *Evite de ser banido ou castigado. Leiam as ${client.channels.cache.get("756261165008551977")} para isso não acontecer !*

		`)
											.setColor("Red")
											.setTimestamp()
											.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
											.setURL("https://github.com/ItaChiGabriel")
											.setFooter({ text: `${interaction.guild.name} ~ Copyright © ${new Date().getFullYear()} / Todos os direitos reservados / ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })

										let row = new ActionRowBuilder()
											.addComponents(
												new ButtonBuilder()
													.setCustomId("SairTicket")
													// .setEmoji("🚪")
													.setStyle(ButtonStyle.Success)
													.setLabel("🚪Sair"),

												new ButtonBuilder()
													.setURL("https://punkstudios.com.br")
													// .setEmoji("🌍")
													.setStyle(ButtonStyle.Link)
													.setLabel("🌍Nosso Site"),


												new ButtonBuilder()
													.setCustomId("AddMember")
													.setLabel("🫂 Adicionar Membro")
													.setStyle(ButtonStyle.Secondary),

												new ButtonBuilder()
													.setCustomId("RmMember")
													.setLabel("🤢 Remover Membro")
													.setStyle(ButtonStyle.Danger)

											)

										let ticketCreate = new EmbedBuilder()
											.setDescription(`**✔️ | ${interaction.user}, seu ticket foi criado. Click no botão abaixo para ser redirecionado !**`)
											.setColor("Red")

										const rowCreateTicket = new ActionRowBuilder()
											.addComponents(
												new ButtonBuilder()
													.setURL(`https://discord.com/channels/677696861636657153/${msg.id}`)
													.setStyle(ButtonStyle.Link)
													.setLabel(`🔗 ${msg.name}`)
											)

										interaction.reply({ embeds: [ticketCreate], components: [rowCreateTicket], ephemeral: true })

										msg.send({ embeds: [embedT], components: [row] })



									})
								}
							})

						})
					}
				})
			}
			if (value == "Suporte de Modelagem") {
				connection.query(`SELECT * FROM tickets WHERE  id_discord = "${interaction.user.id}"`, (err, result) => {
					if (err) {
						return interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
					} else if (result) {

						if (result[0]) {
							let embed = new EmbedBuilder()
								.setDescription(`**❌ | ${interaction.user}, Você já tem um ticket com a categoria ** *${result[0].categoria}* ** aberta. Não será possivel criar outro ticket ! **`)
								.setColor("Red");

							return interaction.reply({ embeds: [embed], ephemeral: true });
						}

						const channelCreate = interaction.guild.channels.create({
							name: `【𝙎𝙪𝙥𝙤𝙧𝙩𝙚 𝙙𝙚 𝙈𝙤𝙙𝙚𝙡𝙖𝙜𝙚𝙢】・${interaction.user.tag}`,
							type: ChannelType.GuildText,
							parent: "1102951185943646218",
							permissionOverwrites: [


								{
									id: interaction.guild.roles.everyone.id,
									deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
								},

								{
									id: interaction.user.id,
									allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
								},
								{
									id: "1102970651452649532",
									allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.ManageMessages]
								},
							]
						})
						channelCreate.then(channelid => {
							connection.query(`INSERT INTO tickets (nome, id_discord, categoria, channel) VALUES ("${interaction.user.username}","${interaction.user.id}","Modelagem", "${channelid.id}")`, (err, result) => {
								if (err) {
									interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
								} else if (result) {
									channelCreate.then(msg => {

										let embedT = new EmbedBuilder()
											.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
											.setTitle("Suporte de Modelagem !")
											.setDescription(`**🌟 | ${interaction.user}, seja bem vindo ao seu ticket.** *Aguarde os modeladores responde-lo(a)*
				  
					⚠ | *Evite de ser banido ou castigado. Leiam as ${client.channels.cache.get("756261165008551977")} para isso não acontecer !*
			
					`)
											.setColor("Red")
											.setTimestamp()
											.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
											.setURL("https://github.com/ItaChiGabriel")
											.setFooter({ text: `${interaction.guild.name} ~ Copyright © ${new Date().getFullYear()} / Todos os direitos reservados / ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })

										let row = new ActionRowBuilder()
											.addComponents(
												new ButtonBuilder()
													.setCustomId("SairTicket")
													// .setEmoji("🚪")
													.setStyle(ButtonStyle.Success)
													.setLabel("🚪Sair"),

												new ButtonBuilder()
													.setURL("https://punkstudios.com.br")
													// .setEmoji("🌍")
													.setStyle(ButtonStyle.Link)
													.setLabel("🌍Nosso Site"),

												new ButtonBuilder()
													.setCustomId("AddMember")
													.setLabel("🫂 Adicionar Membro")
													.setStyle(ButtonStyle.Secondary),

												new ButtonBuilder()
													.setCustomId("RmMember")
													.setLabel("🤢 Remover Membro")
													.setStyle(ButtonStyle.Danger)
											)


										let ticketCreate = new EmbedBuilder()
											.setDescription(`**✔️ | ${interaction.user}, seu ticket foi criado. Click no botão abaixo para ser redirecionado !**`)
											.setColor("Red")

										const rowCreateTicket = new ActionRowBuilder()
											.addComponents(
												new ButtonBuilder()
													.setURL(`https://discord.com/channels/677696861636657153/${msg.id}`)
													.setStyle(ButtonStyle.Link)
													.setLabel(`🔗 ${msg.name}`)
											)

										interaction.reply({ embeds: [ticketCreate], components: [rowCreateTicket], ephemeral: true })

										msg.send({ embeds: [embedT], components: [row] })

									})
								}
							})
						})
					}
				})
			}
			if (value == "Orçamento de Modelagem") {
				connection.query(`SELECT * FROM tickets WHERE  id_discord = "${interaction.user.id}"`, (err, result) => {
					if (err) {
						return interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
					} else if (result) {

						if (result[0]) {
							let embed = new EmbedBuilder()
								.setDescription(`**❌ | ${interaction.user}, Você já tem um ticket com a categoria ** *${result[0].categoria}* ** aberta. Não será possivel criar outro ticket ! **`)
								.setColor("Red");

							return interaction.reply({ embeds: [embed], ephemeral: true });
						}

						const channelCreate = interaction.guild.channels.create({
							name: `【𝙊𝙧𝙘̧𝙖𝙢𝙚𝙣𝙩𝙤 𝙙𝙚 𝙈𝙤𝙙𝙚𝙡𝙖𝙜𝙚𝙢】・${interaction.user.tag}`,
							type: ChannelType.GuildText,
							parent: "1102951185943646218",
							permissionOverwrites: [


								{
									id: interaction.guild.roles.everyone.id,
									deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
								},

								{
									id: interaction.user.id,
									allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
								},
								{
									id: "1102970651452649532",
									allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.ManageMessages]
								},
							]
						})
						channelCreate.then(channelid => {
							connection.query(`INSERT INTO tickets (nome, id_discord, categoria, channel) VALUES ("${interaction.user.username}","${interaction.user.id}","Modelagem", "${channelid.id}")`, (err, result) => {
								if (err) {
									interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
								} else if (result) {
									channelCreate.then(msg => {

										let embedT = new EmbedBuilder()
											.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
											.setTitle("Orçamento de Modelagem !")
											.setDescription(`**🌟 | ${interaction.user}, seja bem vindo ao seu ticket.** *Aguarde os modeladores responde-lo(a), em quanto isso você pode comentar como quer a modelagem.*
				  
					⚠ | *Evite de ser banido ou castigado. Leiam as ${client.channels.cache.get("756261165008551977")} para isso não acontecer !*
			
					`)
											.setColor("Red")
											.setTimestamp()
											.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
											.setURL("https://github.com/ItaChiGabriel")
											.setFooter({ text: `${interaction.guild.name} ~ Copyright © ${new Date().getFullYear()} / Todos os direitos reservados / ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })

										let row = new ActionRowBuilder()
											.addComponents(
												new ButtonBuilder()
													.setCustomId("SairTicket")
													// .setEmoji("🚪")
													.setStyle(ButtonStyle.Success)
													.setLabel("🚪Sair"),

												new ButtonBuilder()
													.setURL("https://punkstudios.com.br")
													// .setEmoji("🌍")
													.setStyle(ButtonStyle.Link)
													.setLabel("🌍Nosso Site"),

												new ButtonBuilder()
													.setCustomId("AddMember")
													.setLabel("🫂 Adicionar Membro")
													.setStyle(ButtonStyle.Secondary),

												new ButtonBuilder()
													.setCustomId("RmMember")
													.setLabel("🤢 Remover Membro")
													.setStyle(ButtonStyle.Danger)
											)


										let ticketCreate = new EmbedBuilder()
											.setDescription(`**✔️ | ${interaction.user}, seu ticket foi criado. Click no botão abaixo para ser redirecionado !**`)
											.setColor("Red")

										const rowCreateTicket = new ActionRowBuilder()
											.addComponents(
												new ButtonBuilder()
													.setURL(`https://discord.com/channels/677696861636657153/${msg.id}`)
													.setStyle(ButtonStyle.Link)
													.setLabel(`🔗 ${msg.name}`)
											)

										interaction.reply({ embeds: [ticketCreate], components: [rowCreateTicket], ephemeral: true })

										msg.send({ embeds: [embedT], components: [row] })

									})
								}
							})
						})
					}
				})
			}
			if (value == "Reportar Bug de Modelagem") {
				connection.query(`SELECT * FROM tickets WHERE  id_discord = "${interaction.user.id}"`, (err, result) => {
					if (err) {
						return interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
					} else if (result) {

						if (result[0]) {
							let embed = new EmbedBuilder()
								.setDescription(`**❌ | ${interaction.user}, Você já tem um ticket com a categoria ** *${result[0].categoria}* ** aberta. Não será possivel criar outro ticket ! **`)
								.setColor("Red");

							return interaction.reply({ embeds: [embed], ephemeral: true });
						}

						const channelCreate = interaction.guild.channels.create({
							name: `【𝙍𝙚𝙥𝙤𝙧𝙩𝙖𝙧 𝘽𝙪𝙜 𝙙𝙚 𝙈𝙤𝙙𝙚𝙡𝙖𝙜𝙚𝙢】・${interaction.user.tag}`,
							type: ChannelType.GuildText,
							parent: "1102951185943646218",
							permissionOverwrites: [


								{
									id: interaction.guild.roles.everyone.id,
									deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
								},

								{
									id: interaction.user.id,
									allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
								},
								{
									id: "1102970651452649532",
									allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.ManageMessages]
								},
							]
						})
						channelCreate.then(channelid => {
							connection.query(`INSERT INTO tickets (nome, id_discord, categoria, channel) VALUES ("${interaction.user.username}","${interaction.user.id}","Modelagem", "${channelid.id}")`, (err, result) => {
								if (err) {
									interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
								} else if (result) {
									channelCreate.then(msg => {

										let embedT = new EmbedBuilder()
											.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
											.setTitle("Reportar Bug de Modelagem !")
											.setDescription(`**🌟 | ${interaction.user}, seja bem vindo ao seu ticket.** *Diga-nos o que aconteceu com a modelagem ?*
				  
					⚠ | *Evite de ser banido ou castigado. Leiam as ${client.channels.cache.get("756261165008551977")} para isso não acontecer !*
			
					`)
											.setColor("Red")
											.setTimestamp()
											.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
											.setURL("https://github.com/ItaChiGabriel")
											.setFooter({ text: `${interaction.guild.name} ~ Copyright © ${new Date().getFullYear()} / Todos os direitos reservados / ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })

										let row = new ActionRowBuilder()
											.addComponents(
												new ButtonBuilder()
													.setCustomId("SairTicket")
													// .setEmoji("🚪")
													.setStyle(ButtonStyle.Success)
													.setLabel("🚪Sair"),

												new ButtonBuilder()
													.setURL("https://punkstudios.com.br")
													// .setEmoji("🌍")
													.setStyle(ButtonStyle.Link)
													.setLabel("🌍Nosso Site"),

												new ButtonBuilder()
													.setCustomId("AddMember")
													.setLabel("🫂 Adicionar Membro")
													.setStyle(ButtonStyle.Secondary),

												new ButtonBuilder()
													.setCustomId("RmMember")
													.setLabel("🤢 Remover Membro")
													.setStyle(ButtonStyle.Danger)
											)


										let ticketCreate = new EmbedBuilder()
											.setDescription(`**✔️ | ${interaction.user}, seu ticket foi criado. Click no botão abaixo para ser redirecionado !**`)
											.setColor("Red")

										const rowCreateTicket = new ActionRowBuilder()
											.addComponents(
												new ButtonBuilder()
													.setURL(`https://discord.com/channels/677696861636657153/${msg.id}`)
													.setStyle(ButtonStyle.Link)
													.setLabel(`🔗 ${msg.name}`)
											)

										interaction.reply({ embeds: [ticketCreate], components: [rowCreateTicket], ephemeral: true })

										msg.send({ embeds: [embedT], components: [row] })

									})
								}
							})
						})
					}
				})
			}
			if (value == "Outros") {
				connection.query(`SELECT * FROM tickets WHERE  id_discord = "${interaction.user.id}"`, (err, result) => {
					if (err) {
						return interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
					} else if (result) {

						if (result[0]) {
							let embed = new EmbedBuilder()
								.setDescription(`**❌ | ${interaction.user}, Você já tem um ticket com a categoria ** *${result[0].categoria}* ** aberta. Não será possivel criar outro ticket ! **`)
								.setColor("Red");

							return interaction.reply({ embeds: [embed], ephemeral: true });
						}



						const channelCreate = interaction.guild.channels.create({
							name: `【𝙊𝙪𝙩𝙧𝙤𝙨】・${interaction.user.tag}`,
							type: ChannelType.GuildText,
							parent: "945011737739010048",
							permissionOverwrites: [
								{
									id: interaction.guild.roles.everyone.id,
									deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
								},

								{
									id: interaction.user.id,
									allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
								}
							]
						})
						channelCreate.then(channelid => {
							connection.query(`INSERT INTO tickets (nome, id_discord, categoria, channel) VALUES ("${interaction.user.username}","${interaction.user.id}","Outros", "${channelid.id}")`, (err, result) => {
								if (err) {
									interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
								} else if (result) {
									channelCreate.then(msg => {

										let embedT = new EmbedBuilder()
											.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
											.setTitle("Outros !")
											.setDescription(`**🌟 | ${interaction.user}, seja bem vindo ao seu ticket.** *O que deseja ?*
	  
		⚠ | *Evite de ser banido ou castigado. Leiam as ${client.channels.cache.get("756261165008551977")} para isso não acontecer !*

		`)
											.setColor("Red")
											.setTimestamp()
											.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
											.setURL("https://github.com/ItaChiGabriel")
											.setFooter({ text: `${interaction.guild.name} ~ Copyright © ${new Date().getFullYear()} / Todos os direitos reservados / ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })

										let row = new ActionRowBuilder()
											.addComponents(
												new ButtonBuilder()
													.setCustomId("SairTicket")
													// .setEmoji("🚪")
													.setStyle(ButtonStyle.Success)
													.setLabel("🚪Sair"),

												new ButtonBuilder()
													.setURL("https://punkstudios.com.br")
													// .setEmoji("🌍")
													.setStyle(ButtonStyle.Link)
													.setLabel("🌍Nosso Site"),

												new ButtonBuilder()
													.setCustomId("AddMember")
													.setLabel("🫂 Adicionar Membro")
													.setStyle(ButtonStyle.Secondary),

												new ButtonBuilder()
													.setCustomId("RmMember")
													.setLabel("🤢 Remover Membro")
													.setStyle(ButtonStyle.Danger)
											)

										let ticketCreate = new EmbedBuilder()
											.setDescription(`**✔️ | ${interaction.user}, seu ticket foi criado. Click no botão abaixo para ser redirecionado !**`)
											.setColor("Red")

										const rowCreateTicket = new ActionRowBuilder()
											.addComponents(
												new ButtonBuilder()
													.setURL(`https://discord.com/channels/677696861636657153/${msg.id}`)
													.setStyle(ButtonStyle.Link)
													.setLabel(`🔗 ${msg.name}`)
											)

										interaction.reply({ embeds: [ticketCreate], components: [rowCreateTicket], ephemeral: true })

										msg.send({ embeds: [embedT], components: [row] })


									})
								}
							})
						})
					}
				})
			}

		}

		if (interaction.isButton()) {

			if (interaction.customId.includes("SairTicket")) {

				connection.query(`SELECT * FROM tickets WHERE id_discord = "${interaction.user.id}" and nome = "${interaction.user.username}"`, async (err, result) => {
					if (err) return interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
					else if (result) {
						if (!result[0]) {

							return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode interagir com o botão. Só o dono do ticket que tem permissão !**`, ephemeral: true });

						}
						if (result[0].id_discord == "704425386007724034") {
							return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode interagir com o botão. Só o dono do ticket que tem permissão !**`, ephemeral: true });
						}
						if (result[0].id_discord == "351875751571750923") {
							return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode interagir com o botão. Só o dono do ticket que tem permissão !**`, ephemeral: true });
						}

						connection.query(`SELECT * FROM parceiro_ticket WHERE adicionadoPor = "${interaction.user.id}" and channel = "${interaction.channel.id}"`, (err, result) => {
							if (err) return interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
							else if (result) {
								if (result[0]) {

									interaction.channel.permissionOverwrites.edit(result[0].id_discord, { SendMessages: false, ViewChannel: false });

									interaction.guild.roles.fetch(result[0].cargoid).then(rolePar => {
										rolePar.delete().catch(err => console.log({}));
									})

									connection.query(`DELETE FROM parceiro_ticket WHERE adicionadoPor = "${interaction.user.id}" and channel = "${interaction.channel.id}"`, (err, result) => {
										if (err) return interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
									})

								}

							}
						})


						connection.query(`DELETE FROM tickets WHERE  id_discord = "${interaction.user.id}"`, (err, result) => {
							if (err) {
								return interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
							} else if (result) {

								let embedSaiu = new EmbedBuilder()
									.setDescription(`**✔️ | ${interaction.user}, você saiu do ticket com sucesso.**`)
									.setColor("Red");

								interaction.reply({ embeds: [embedSaiu], ephemeral: true });
								interaction.channel.permissionOverwrites.edit(interaction.user.id, { SendMessages: false, ViewChannel: false });
								setTimeout(() => {
									interaction.channel.setName("【𝙁𝙚𝙘𝙝𝙖𝙙𝙤】");
								}, 2000)

								let MembroSaiu = new EmbedBuilder()
									.setDescription(`**⚠ | membro saiu do ticket. O que deseja fazer ? Escolha umas das opções abaixo !**`)
									.setColor("Red")

								const rowsaida = new ActionRowBuilder()
									.addComponents(
										new ButtonBuilder()
											.setCustomId("Fechar")
											.setLabel("Deletar Ticket")
											.setStyle("Primary"),
										new ButtonBuilder()
											.setCustomId("backup_ticket")
											.setLabel("Backup")
											.setStyle("Primary"),
									)
								setTimeout(() => {
									interaction.channel.send({ embeds: [MembroSaiu], components: [rowsaida] })
								}, 2000)
							}
						})
					}
				})
			}



			// Button admin

			if (interaction.customId.includes("Fechar")) {

				if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
					let notpermission = new EmbedBuilder()
						.setDescription(`**❌ | ${interaction.user}, você não tem permissão para interagir com esse botão.**`)
						.setColor("Red");

					return interaction.reply({ embeds: [notpermission], ephemeral: true })
				}

				let deletar = new EmbedBuilder()
					.setDescription(`**✔️ | ${interaction.user}, esse ticket será deletado em 5 segundos.**`)
					.setColor("Red");

				interaction.reply({ embeds: [deletar], ephemeral: true })

				setTimeout(() => {
					interaction.channel.delete().catch(err => ({}));
				}, 5000)
			}

			if (interaction.customId.includes("backup_ticket")) {

				if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
					let notpermission = new EmbedBuilder()
						.setDescription(`**❌ | ${interaction.user}, você não tem permissão para interagir com esse botão.**`)
						.setColor("Red");

					return interaction.reply({ embeds: [notpermission], ephemeral: true })
				}

				let transcript = new EmbedBuilder()
					.setTitle("Backup Ticket")
					.setDescription(`**📂 | ${interaction.user}, O backup está pronto !**`)
					.setColor("Red")


				const attachment = await createTranscript(interaction.channel, {
					returnType: 'attachment',
					fileName: 'punkstudios_ticket.html',
					saveImages: false,
				})

				interaction.reply({ embeds: [transcript], ephemeral: true, files: [attachment] })

			}

			// button add/rM Member

			if (interaction.customId.includes("AddMember")) {

				connection.query(`SELECT * FROM tickets WHERE id_discord = "${interaction.user.id}";`, async (err, result) => {
					if (err) return interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
					else if (result) {
						if (!result[0]) {
							return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode interagir com o botão. Só o dono do ticket que tem permissão !**`, ephemeral: true });
						}


						const modalAdd = new ModalBuilder()
							.setCustomId("ModalADD")
							.setTitle("Adicionar Membro")

						const inputIdMember = new TextInputBuilder()
							.setCustomId("inputIdMember")
							.setLabel("Qual é o id do seu parceiro?")
							.setPlaceholder("id aqui")
							.setStyle(TextInputStyle.Short)
							.setRequired(true)

						const rowInput = new ActionRowBuilder()
							.addComponents(
								inputIdMember
							)

						modalAdd.addComponents(rowInput);

						await interaction.showModal(modalAdd);

					}
				})
			}

			if (interaction.customId.includes("RmMember")) {

				connection.query(`SELECT * FROM tickets WHERE id_discord = "${interaction.user.id}";`, async (err, result) => {
					if (err) return interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
					else if (result) {
						if (!result[0]) {
							return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode interagir com o botão. Só o dono do ticket que tem permissão !**`, ephemeral: true });
						}

						const modalRemove = new ModalBuilder()
							.setCustomId("ModalRM")
							.setTitle("Remover Membro")

						const inputIdMemberRM = new TextInputBuilder()
							.setCustomId("inputIdMemberRM")
							.setLabel("Qual é o id do seu parceiro?")
							.setPlaceholder("id aqui")
							.setStyle(TextInputStyle.Short)
							.setRequired(true)

						const rowInput = new ActionRowBuilder()
							.addComponents(
								inputIdMemberRM
							)

						modalRemove.addComponents(rowInput);

						await interaction.showModal(modalRemove);
					}
				})
			}
		}


		//Modal

		if (interaction.isModalSubmit()) {

			if (interaction.customId.includes("ModalADD")) {
				const inputgetIDMemberADD = interaction.fields.getTextInputValue("inputIdMember");

				if (Number.isNaN(+inputgetIDMemberADD)) {
					return interaction.reply({ content: `**❌ | ${interaction.user}, isso não é um número.**`, ephemeral: true })
				}
				let userM = await client.users.fetch(inputgetIDMemberADD).catch(err => console.log())


				if (!userM) {
					return interaction.reply({ content: `**❌ | ${interaction.user}, não existe nenhum membro com esse id.**`, ephemeral: true })

				}
				if (inputgetIDMemberADD == "942426973030981642") {
					return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode adicionar esse membro.**`, ephemeral: true })
				}
				if (inputgetIDMemberADD == "476259371912003597") {
					return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode adicionar esse membro.**`, ephemeral: true })
				}
				if (inputgetIDMemberADD == "234395307759108106") {
					return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode adicionar esse membro.**`, ephemeral: true })
				}
				if (inputgetIDMemberADD == "416358583220043796") {
					return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode adicionar esse membro.**`, ephemeral: true })
				}
				if (inputgetIDMemberADD == "883392424301428736") {
					return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode adicionar esse membro.**`, ephemeral: true })
				}
				if (inputgetIDMemberADD == "704425386007724034") {
					return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode adicionar esse membro.**`, ephemeral: true })
				}
				if (inputgetIDMemberADD == "351875751571750923") {
					return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode adicionar esse membro.**`, ephemeral: true })
				}

				if (inputgetIDMemberADD == interaction.guild.ownerId) {
					return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode adicionar esse membro.**`, ephemeral: true })
				}

				if (inputgetIDMemberADD == client.user.id) {
					return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode adicionar esse membro.**`, ephemeral: true })
				}

				if (inputgetIDMemberADD == interaction.user.id) {
					return interaction.reply({ content: `**❌ | ${interaction.user}, você já está no ticket.**`, ephemeral: true })
				}
				client.users.fetch(inputgetIDMemberADD).then(async Userv => {
					connection.query(`SELECT * FROM parceiro_ticket WHERE id_discord = "${Userv.id}" and channel = "${interaction.channel.id}"`, (err, result) => {
						if (err) return interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
						else if (result) {
							if (result[0]) {
								return interaction.reply({ content: `**❌ | ${interaction.user}, esse membro já está no ticket.**`, ephemeral: true });
							}

							client.users.fetch(inputgetIDMemberADD).then(async user => {
								const rolesfriend = interaction.guild.roles.create({ name: `Parceiro do ${interaction.user.tag}` })
								rolesfriend.then(role => {
									connection.query(`INSERT INTO parceiro_ticket (nome, id_discord, channel, adicionadoPor, cargoid) VALUES ("${user.username}","${user.id}","${interaction.channel.id}","${interaction.user.id}", "${role.id}")`, async (err, result) => {
										if (err) return interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
										else if (result) {

											await interaction.channel.permissionOverwrites.edit(user.id, { ViewChannel: true, SendMessages: true }).catch(err => console.log(err));
											rolesfriend.then(role2 => {
												interaction.guild.members.fetch(user.id).then(roleMember => {


													roleMember.roles.add(role2.id)
												})
											})

											return interaction.reply({ content: `**✔️ | ${interaction.user}, ${client.users.cache.get(inputgetIDMemberADD)} foi adicionado com sucesso no ticket.**`, ephemeral: true })
										}
									})
								})
							})

						}
					})
				})

			}

			// RemoverMember

			if (interaction.customId.includes("ModalRM")) {
				const inputgetIDMemberADD = interaction.fields.getTextInputValue("inputIdMemberRM");

				if (Number.isNaN(+inputgetIDMemberADD)) {
					return interaction.reply({ content: `**❌ | ${interaction.user}, isso não é um número.**`, ephemeral: true })
				}
				let userM = await client.users.fetch(inputgetIDMemberADD).catch(err => console.log())


				if (!userM) {
					return interaction.reply({ content: `**❌ | ${interaction.user}, não existe nenhum membro com esse id.**`, ephemeral: true })

				}

				if (inputgetIDMemberADD == "942426973030981642") {
					return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode remover esse membro.**`, ephemeral: true })
				}
				if (inputgetIDMemberADD == "476259371912003597") {
					return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode remover esse membro.**`, ephemeral: true })
				}
				if (inputgetIDMemberADD == "234395307759108106") {
					return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode remover esse membro.**`, ephemeral: true })
				}
				if (inputgetIDMemberADD == "416358583220043796") {
					return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode remover esse membro.**`, ephemeral: true })
				}
				if (inputgetIDMemberADD == "883392424301428736") {
					return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode remover esse membro.**`, ephemeral: true })
				}
				if (inputgetIDMemberADD == "704425386007724034") {
					return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode remover esse membro.**`, ephemeral: true })
				}
				if (inputgetIDMemberADD == "351875751571750923") {
					return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode remover esse membro.**`, ephemeral: true })
				}

				if (inputgetIDMemberADD == interaction.guild.ownerId) {
					return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode remover esse membro.**`, ephemeral: true })
				}

				if (inputgetIDMemberADD == client.user.id) {
					return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode remover esse membro.**`, ephemeral: true })
				}

				if (inputgetIDMemberADD == interaction.user.id) {
					return interaction.reply({ content: `**❌ | ${interaction.user}, você não pode se remover.**`, ephemeral: true })
				}
				client.users.fetch(inputgetIDMemberADD).then(async Userv => {
					connection.query(`SELECT * FROM parceiro_ticket WHERE id_discord = "${Userv.id}" and channel = "${interaction.channel.id}"`, (err, result) => {
						if (err) return interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
						else if (result) {
							if (!result[0]) {
								return interaction.reply({ content: `**❌ | ${interaction.user}, esse membro não está no ticket.**`, ephemeral: true });
							}

							client.users.fetch(inputgetIDMemberADD).then(async user => {

								connection.query(`SELECT * FROM parceiro_ticket WHERE id_discord = "${user.id}" and channel = "${interaction.channel.id}"`, (err, result) => {
									if (err) return interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
									else if (result) {
										if (result[0]) {

											interaction.guild.roles.fetch(result[0].cargoid).then(rolePar => {
												rolePar.delete().catch(err => console.log({}));
											})

											connection.query(`DELETE FROM parceiro_ticket WHERE id_discord = "${user.id}" and channel = "${interaction.channel.id}" `, async (err, result) => {
												if (err) return interaction.reply({ content: "**❌ | Aconteceu algo inesperado.**", ephemeral: true });
												else if (result) {

													await interaction.channel.permissionOverwrites.edit(user.id, { ViewChannel: false, SendMessages: false }).catch(err => console.log(err));

													return interaction.reply({ content: `**✔️ | ${interaction.user}, ${client.users.cache.get(inputgetIDMemberADD)} foi removido com sucesso no ticket.**`, ephemeral: true })
												}
											})

										}
									}
								})


							})

						}
					})
				})
			}
		}
	}
}

