const { EmbedBuilder, SlashCommandBuilder, Client, CommandInteraction, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { hostdb, userdb, passwordDB, databasedb, charsetdb } = require("../../util/dbBase_dados_Ready");
const mysql = require("mysql2")
module.exports = {
    data: new SlashCommandBuilder()
    .setName("buscar_produto_cliente")
    .setDescription("Esse comando serve para buscar todos os produtos que o cliente tem.")
    .addUserOption(Option => 
        Option.setName("nome_cliente")
        .setDescription("Mencione o cliente que deseja adicionar.")
        .setRequired(true)),

/**
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */

       async execute(client, interaction){
        if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)){
            const EmbedAvisoPerm = new EmbedBuilder()
                .setDescription(`**❌ | ${interaction.user}, você não tem permissão para executar esse comando.**`)
                .setColor("#F95D2C")
            return interaction.reply({ embeds: [EmbedAvisoPerm], ephemeral: true });
        }

        let Connection
        function DbConnectReady() {
            Connection = new mysql.createConnection({
                host: hostdb,
                user: userdb,
                password: passwordDB,
                database: databasedb,
                charset: charsetdb
            })
            Connection.connect(function (err) {
                if (err) {
                    console.log(`Erro ao conectar na database, addcupom ${err}`);
                    setTimeout(bancodedados, 2000);
                }
            });
            Connection.on('error', function (err) {
                console.log('database erro RESET...');
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    return
                }
            });
        }
        DbConnectReady()

        const ClientUser = interaction.options.getUser("nome_cliente");
        let currentPage = 0;
        let resultsPerPage = 5; 

        Connection.query(`SELECT * FROM protection WHERE discord = "${ClientUser.id}"`, (err,response) => {
            if(err) return interaction.reply({content: `⚠️ | Aconteceu algo inesperado. (S+Produtos)`, ephemeral: true})
            if (response && response.length > 0) {
                const numPages = Math.ceil(response.length / resultsPerPage);
        
                const generateEmbed = (page) => {
                  const start = page * resultsPerPage;
                  const end = start + resultsPerPage;
                  const slicedResults = response.slice(start, end);
                  
                  let description = "";
                  
                            slicedResults.forEach((result, index) => {
                              description += `${result.produto || 'N/A'}\n\n`;
                            });

                  const embed = {
                    title: `produtos de ${ClientUser.username}`,
                    color: parseInt("F95D2C", 16),
                    description: `**${description}**`,
                    thumbnail: { url: interaction.guild.iconURL({ dynamic: true }) },
                    // fields: [], 
                    footer: {
                      text: `Página ${page + 1}/${numPages}`
                    }
                  };
        
                  return embed;
                };

                const previousButton = new ButtonBuilder()
                .setCustomId('previous')
                .setLabel('◀️')
                .setStyle(ButtonStyle.Primary);
    
              const nextButton = new ButtonBuilder()
                .setCustomId('next')
                .setLabel('▶️')
                .setStyle(ButtonStyle.Primary);
    
              const row = new ActionRowBuilder().addComponents(previousButton, nextButton);
        
                interaction.reply({ embeds: [generateEmbed(currentPage)],  components: [row]}).then((sentMessage) => {
        
                    const collector = sentMessage.createMessageComponentCollector({
                        filter: (i) => i.user.id === interaction.user.id,
                        time: 60000,
                      });
                      
                      collector.on('collect', (interaction) => {
                        if (interaction.customId === 'previous') {
                          currentPage = Math.max(0, currentPage - 1);
                        } else if (interaction.customId === 'next') {
                          currentPage = Math.min(numPages - 1, currentPage + 1);
                        }
                      
                        interaction.update({
                          embeds: [generateEmbed(currentPage)],
                          components: [row],
                        });
                      });
                      
                      collector.on('end', () => {
                        sentMessage.edit({ components: [] });
                      });
                });
              } else {
                interaction.reply({content: `${interaction.user}, esse client não tem nenhum produto.`, ephemeral: true});
              }
            });

       }
}
