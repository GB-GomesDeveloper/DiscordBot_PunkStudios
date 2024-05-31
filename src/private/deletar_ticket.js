const { SlashCommandBuilder, EmbedBuilder, CommandInteraction, Client, PermissionFlagsBits } = require("discord.js");
const { hostdb, userdb, passwordDB, databasedb, charsetdb } = require("../../util/dbBase_dados_Ready")
const mysql = require("mysql2")

module.exports = {

    data: new SlashCommandBuilder()
        .setName("deletar_ticket")
        .setDescription("Esse comando server para deletar os tickets.")
        .addUserOption(Option =>
            Option.setName("donoticket")
                .setDescription("Escolhe o dono do ticket para remover o ticket.")
                .setRequired(true)),

    /**
    
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(client, interaction) {


        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const embed = new EmbedBuilder()
                .setDescription(`**❌ | ${interaction.user}, você não tem permissão para executar esse comando.**`)
                .setColor("Red")
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }

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
                    setTimeout(bancodedados, 2000);
                }
            });
            connection.on('error', function (err) {
                console.log('database erro RESET...');
                if (err.code === 'PROTOCOL_connection_LOST') {
                    return
                }
            });
        }
        DbConnectReady()
        // 
        const inputUser = interaction.options.getUser("donoticket")

        // if (interaction.member.roles.cache.some(r => r.id === "1102970651452649532")) {

        //     connection.query(`SELECT * FROM tickets where id_discord= "${inputUser.id}" and categoria = "Modelagem"`, (err, result) => {
        //         if (err) return interaction.reply({ content: `**⚠️ | Aconteceu algo inesperado.**`, ephemeral: true })
        //         else if (result) {
        //             if (!result[0]) {
        //                 let avisoN = new EmbedBuilder()
        //                     .setDescription(`**❌ | ${interaction.user}, esse membro não tem nenhum ticket de modelagem.**`)
        //                     .setColor("Red")

        //                 return interaction.reply({ embeds: [avisoN], ephemeral: true });
        //             } else {

        //                 connection.query(`SELECT * FROM parceiro_ticket WHERE adicionadoPor = "${inputUser.id}" and channel = "${result[0].channel}"`, async (err, gabriel) => {
        //                     if (err) return interaction.reply({ content: `**⚠️ | Aconteceu algo inesperado.**`, ephemeral: true })
        //                     else if (gabriel) {

        //                         if (gabriel[0]) {

        //                             interaction.guild.channels.cache.get(result[0].channel).delete().catch(err => console.log());

        //                             connection.query(`DELETE FROM tickets WHERE id_discord = "${inputUser.id}" and categoria = "Modelagem"`, (err, gabriel) => {
        //                                 if (err) return interaction.reply({ content: `**⚠️ | Aconteceu algo inesperado.**`, ephemeral: true })
        //                             })
        //                             connection.query(`DELETE FROM parceiro_ticket WHERE id_discord = "${gabriel[0].id_discord}"`, (err, gabriel) => {
        //                                 if (err) return interaction.reply({ content: `**⚠️ | Aconteceu algo inesperado.**`, ephemeral: true })
        //                             })

        //                             await interaction.reply({ content: `**✔️ | ${interaction.user}, ticket de modelagem removido com sucesso !**` }).catch(err => console.log());


        //                         } else {
        //                             interaction.guild.channels.cache.get(result[0].channel).delete().catch(err => console.log());

        //                             connection.query(`DELETE FROM tickets WHERE id_discord = "${inputUser.id}" and categoria = "Modelagem"`, (err, gabriel) => {
        //                                 if (err) return interaction.reply({ content: `**⚠️ | Aconteceu algo inesperado.**`, ephemeral: true })
        //                             })
        //                             await interaction.reply({ content: `**✔️ | ${interaction.user}, o ticket será deletado em 5 segundos . !**` }).catch(err => console.log());
        //                         }
        //                     }

        //                 })
        //             }
        //         }

        //     })
        connection.query(`SELECT * FROM tickets where id_discord= "${inputUser.id}"`, (err, result) => {
            if (err) return interaction.reply({ content: `**⚠️ | Aconteceu algo inesperado.**`, ephemeral: true })
            else if (result) {
                if (!result[0]) {
                    let avisoN = new EmbedBuilder()
                        .setDescription(`**❌ | ${interaction.user}, esse membro não tem nenhum ticket.**`)
                        .setColor("#F95D2C")

                    return interaction.reply({ embeds: [avisoN], ephemeral: true });
                } else {

                    connection.query(`SELECT * FROM parceiro_ticket WHERE adicionadoPor = "${inputUser.id}" and channel = "${result[0].channel}"`, async (err, gabriel) => {
                        if (err) return interaction.reply({ content: `**⚠️ | Aconteceu algo inesperado.**`, ephemeral: true })
                        else if (gabriel) {

                            if (gabriel[0]) {

                                setTimeout(() => {
                                    interaction.guild.channels.cache.get(result[0].channel).delete().catch(err => console.log());
                                }, 5000)

                                connection.query(`DELETE FROM tickets WHERE id_discord = "${inputUser.id}"`, (err, gabriel) => {
                                    if (err) return interaction.reply({ content: `**⚠️ | Aconteceu algo inesperado.**`, ephemeral: true })
                                })
                                connection.query(`DELETE FROM parceiro_ticket WHERE id_discord = "${gabriel[0].id_discord}"`, (err, gabriel) => {
                                    if (err) return interaction.reply({ content: `**⚠️ | Aconteceu algo inesperado.**`, ephemeral: true })
                                })

                                await interaction.reply({ content: `**✔️ | ${interaction.user}, o ticket será deletado em 5 segundos.**` }).catch(err => console.log());


                            } else {
                                setTimeout(() => {
                                    interaction.guild.channels.cache.get(result[0].channel).delete().catch(err => console.log());
                                }, 5000)

                                connection.query(`DELETE FROM tickets WHERE id_discord = "${inputUser.id}"`, (err, gabriel) => {
                                    if (err) return interaction.reply({ content: `**⚠️ | Aconteceu algo inesperado.**`, ephemeral: true })
                                })
                                await interaction.reply({ content: `**✔️ | ${interaction.user}, o ticket será deletado em 5 segundos.**` }).catch(err => console.log());
                            }
                        }

                    })
                }
            }

        })
    }
}