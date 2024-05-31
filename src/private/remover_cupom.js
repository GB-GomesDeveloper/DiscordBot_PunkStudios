const { SlashCommandBuilder, Client, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { hostdb, userdb, passwordDB, databasedb, charsetdb } = require("../../util/dbBase_dados_Ready");
const mysql = require("mysql2");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("remover_cupom")
        .setDescription("Esse comando serve para remover cupom no site.")
        .addStringOption(Option => Option.setName("cupom")
            .setDescription("Mencione o cupom.")
            .setRequired(true)),

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async execute(client, interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const embedPermission = new EmbedBuilder()
                .setDescription(`**❌ | ${interaction.user}, você não tem permissão para executar esse comando.**`)
                .setColor("#F95D2C")
            return interaction.reply({ embeds: [embedPermission], ephemeral: true });
        }

        const cupom = interaction.options.getString("cupom")
        const desconto = interaction.options.getString("desconto")

        // db
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

        Connection.query(`SELECT * FROM cupom WHERE codigo = '${cupom}'`, (err, response) => {
            if (err) return console.log("Err: " + err)
            else if (!response[0]) {
            const ExisteCupom = new EmbedBuilder()
            .setDescription(`**❌ | ${interaction.user}, esse cupom não existe no sistema.**`)
            .setColor("#F95D2C")
            return interaction.reply({embeds: [ExisteCupom], ephemeral: true});
            }else{
              Connection.query(`DELETE FROM cupom WHERE codigo = "${cupom}"`, (err, response) => {
                if (err) return console.log("Err: " + err);
                if(response){
                    const embedConfirmação = new EmbedBuilder()
                    .setDescription(`**✔️ | ${interaction.user}, cupom removido com sucesso.**`)
                    .setColor("#F95D2C")
                    interaction.reply({embeds: [embedConfirmação], ephemeral: true})
                }
              })
            }
        })
    }
}