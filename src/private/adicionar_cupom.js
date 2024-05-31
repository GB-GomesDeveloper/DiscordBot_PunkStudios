const { SlashCommandBuilder, Client, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { hostdb, userdb, passwordDB, databasedb, charsetdb } = require("../../util/dbBase_dados_Ready");
const mysql = require("mysql2");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("adicionar_cupom")
        .setDescription("Esse comando serve para adicionar cupom no site.")
        .addStringOption(Option => Option.setName("cupom")
            .setDescription("Crie um nome para o cupom.")
            .setRequired(true))
        .addStringOption(Option => Option.setName("desconto")
            .setDescription("Adicione o desconto no cupom.")
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
            else if (response[0]) {
            const ExisteCupom = new EmbedBuilder()
            .setDescription(`**❌ | ${interaction.user}, esse cupom já existe no sistema.**`)
            .setColor("#F95D2C")
            return interaction.reply({embeds: [ExisteCupom], ephemeral: true});
            }else{
              Connection.query(`INSERT INTO cupom (codigo, name, desconto, vencimento) VALUES ("${cupom}","${cupom}","${desconto}", "0")`, (err, response) => {
                if (err) return console.log("Err: " + err);
                if(response){
                    const embedConfirmação = new EmbedBuilder()
                    .setDescription(`**✔️ | ${interaction.user}, cupom adicionado com sucesso.**`)
                    .setColor("#F95D2C")
                    interaction.reply({embeds: [embedConfirmação], ephemeral: true})
                }
              })
            }
        })
    }
}