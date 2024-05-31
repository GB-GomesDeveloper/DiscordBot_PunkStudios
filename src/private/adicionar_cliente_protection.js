const { SlashCommandBuilder, Client, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { hostdb, userdb, passwordDB, databasedb, charsetdb } = require("../../util/dbBase_dados_Ready");
const mysql = require("mysql2");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("adicionar_cliente_protection")
        .setDescription("Esse comando serve para adicionar o cliente no sistema.")
        .addUserOption(Option =>
            Option.setName("nome_cliente")
                .setDescription("Mencione o cliente que deseja adicionar.")
                .setRequired(true))
        .addStringOption(Option =>
            Option.setName("nome_produto")
                .setDescription("Coloque o produto que deseja adicionar para o cliente no sistema.")
                .setRequired(true)),

    /**
     * @param {Client} cliente 
     * @param {CommandInteraction} interaction 
     */

    async execute(cliente, interaction) {

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const EmbedAvisoPerm = new EmbedBuilder()
                .setDescription(`**❌ | ${interaction.user}, você não tem permissão para executar esse comando.**`)
                .setColor("#F95D2C")
            return interaction.reply({ embeds: [EmbedAvisoPerm], ephemeral: true });
        }

        const MentionValue = interaction.options.getUser("nome_cliente");
        const StringProdutoValue = interaction.options.getString("nome_produto");

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

        Connection.query(`SELECT * FROM addprodutos WHERE produto = "${StringProdutoValue}"`, (err, response) => {
            if (err) return interaction.reply({ content: "**⚠️ | Aconteceu algo inesperado. (F+Produtos)**", ephemeral: true });
            if (response[0]) {
                const nomeProdutoOriginal = response[0].produto;
                const idprodutoOriginal = response[0].id;
                const valorprodutoOriginal = response[0].valor;

                Connection.query(`SELECT * FROM pedidos WHERE nome_produto = "${nomeProdutoOriginal}" and discord = "${MentionValue.id}"`, (err, response) => {
                    if (err) return interaction.reply({ content: "**⚠️ | Aconteceu algo inesperado. (F+Pedidos)**", ephemeral: true });
                    if (!response[0]) {

                        Connection.query(`SELECT * FROM protection WHERE discord = "${MentionValue.id}" and produto = "${resultadoProdutoMinusculo}"`, (err, response) => {
                            if (err) return interaction.reply({ content: "**⚠️ | Aconteceu algo inesperado. (F+Protection)**", ephemeral: true });
                            if (!response[0]) {
                                Connection.query(`SELECT * FROM protection WHERE discord = "${MentionValue.id}"`, (err, response) => {
                                    if (err) return interaction.reply({ content: "**⚠️ | Aconteceu algo inesperado. (F+ProtectionSelect)**", ephemeral: true });
                                    if (response[0]) {
                                        const codigo = response[0].codigo;
                                        const username = response[0].cliente
                                        console.log(codigo);
                                        Connection.query(`INSERT INTO protection (cliente, discord, produto, codigo) VALUES ("${username}","${MentionValue.id}","${resultadoProdutoMinusculo}","${codigo}")`, (err, response) => {
                                            if (err) return interaction.reply({ content: "**⚠️ | Aconteceu algo inesperado. (F+ProtectionInsert)** " + err, ephemeral: true });
                                            if (response) {
                                                Connection.query(`INSERT INTO pedidos (id_pedido, nome_produto, id_produto, quantidade, preco, status1, cliente, discord, cupom) VALUES ("ManualBot","${nomeProdutoOriginal}","${idprodutoOriginal}","1","${valorprodutoOriginal.replace('.', ',')}","1","${username}","${MentionValue.id}","none")`, (err, response) => {
                                                    if (err) return interaction.reply({ content: "**⚠️ | Aconteceu algo inesperado. (F+PedidoInsert)** " + err, ephemeral: true });
                                                    if (response) {
                                                        const embedSucesso = new EmbedBuilder()
                                                            .setDescription(`**✔️ | ${interaction.user}, produto inserido no sistema com sucesso.**`)
                                                            .setColor("#F95D2C")
                                                        interaction.reply({ embeds: [embedSucesso], ephemeral: true });
                                                    }
                                                })
                                            }
                                        })
                                    } else {
                                        console.log(resultadoProdutoMinusculo)
                                        Connection.query(`INSERT INTO protection (cliente, discord, produto, codigo) VALUES ("${MentionValue.username}","${MentionValue.id}","${resultadoProdutoMinusculo}","Trocar")`, (err, response) => {
                                            if (err) return interaction.reply({ content: "**⚠️ | Aconteceu algo inesperado. (F+ProtectionInsert)** " + err, ephemeral: true });
                                            if (response) {
                                                Connection.query(`INSERT INTO pedidos (id_pedido, nome_produto, id_produto, quantidade, preco, status1, cliente, discord, cupom) VALUES ("ManualBot","${nomeProdutoOriginal}","${idprodutoOriginal}","1","${valorprodutoOriginal}","1","${MentionValue.username}","${MentionValue.id}","none")`, (err, response) => {
                                                    if (err) return interaction.reply({ content: "**⚠️ | Aconteceu algo inesperado. (F+PedidoInsert)** " + err, ephemeral: true });
                                                    if (response) {
                                                        const embedSucesso = new EmbedBuilder()
                                                            .setDescription(`**✔️ | ${interaction.user}, produto inserido no sistema com sucesso.**`)
                                                            .setColor("#F95D2C")
                                                        interaction.reply({ embeds: [embedSucesso], ephemeral: true });
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            } else {
                                Connection.query(`SELECT * FROM pedidos WHERE discord = "${MentionValue.id}" and nome_produto = "${resultadoProdutoMinusculo}"`, (err, response) => {
                                    if (err) return interaction.reply({ content: "**⚠️ | Aconteceu algo inesperado. (F+Protection)**", ephemeral: true });
                                    if (!response[0]){
                                        Connection.query(`INSERT INTO pedidos (id_pedido, nome_produto, id_produto, quantidade, preco, status1, cliente, discord, cupom) VALUES ("ManualBot","${nomeProdutoOriginal}","${idprodutoOriginal}","1","${valorprodutoOriginal}","1","${MentionValue.username}","${MentionValue.id}","none")`, (err, response) => {
                                            if (err) return interaction.reply({ content: "**⚠️ | Aconteceu algo inesperado. (F+PedidoInsert+)** " + err, ephemeral: true });
                                            if (response) {
                                                const embedSucesso = new EmbedBuilder()
                                                .setDescription(`**✔️ | ${interaction.user}, produto inserido no pedidos com sucesso.**`)
                                                .setColor("#F95D2C")
                                                interaction.reply({ embeds: [embedSucesso], ephemeral: true });
                                            }
                                        })
                                    }else{
                                        const embedAviso = new EmbedBuilder()
                                        .setDescription(`**⚠️ | ${interaction.user}, o cliente já tem esse produto.**`)
                                        .setColor("#F95D2C")
                                        interaction.reply({ embeds: [embedAviso], ephemeral: true });
                                    }
                                })
                            }
                        })
                    } else {
                        Connection.query(`SELECT * FROM protection WHERE discord = "${MentionValue.id}" and produto = "${resultadoProdutoMinusculo}"`, (err, response) => {
                            if (err) return interaction.reply({ content: "**⚠️ | Aconteceu algo inesperado. (F+Protection)**", ephemeral: true });
                            if(!response[0]){
                        Connection.query(`INSERT INTO protection (cliente, discord, produto, codigo) VALUES ("${response[0].client}","${MentionValue.id}","${resultadoProdutoMinusculo}","Trocar")`, (err, response) => {
                            if (err) return interaction.reply({ content: "**⚠️ | Aconteceu algo inesperado. (F+ProtectionInsert)** " + err, ephemeral: true });
                            const embedSucesso = new EmbedBuilder()
                                .setDescription(`**✔️ | ${interaction.user}, produto inserido na proteção com sucesso.**`)
                                .setColor("#F95D2C")
                            interaction.reply({ embeds: [embedSucesso], ephemeral: true });
                        })
                    }else{
                        const embedAviso = new EmbedBuilder()
                        .setDescription(`**⚠️ | ${interaction.user}, o cliente já tem esse produto.**`)
                        .setColor("#F95D2C")
                        interaction.reply({ embeds: [embedAviso], ephemeral: true });
                    }
                })
                    }
                })
            } else {
                const embedAviso = new EmbedBuilder()
                    .setDescription(`**⚠️ | ${interaction.user}, esse produto não exite no sistema.**`)
                    .setColor("#F95D2C")
                interaction.reply({ embeds: [embedAviso], ephemeral: true });
            }
        })
    }
}