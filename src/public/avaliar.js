const { SlashCommandBuilder, Client, CommandInteraction, PermissionFlagsBits, EmbedBuilder, Embed } = require("discord.js");
const mysql = require("mysql2")
const { hostdb, userdb, passwordDB, databasedb, charsetdb } = require("../../util/dbBase_dados_Ready")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("avaliar")
        .setDescription("Esse comando serve para você avaliar a loja.")
        .addStringOption(Option =>
            Option.setName("texto")
                .setDescription("Escreva sua avaliação para a loja.")
                .setRequired(true))
                .addNumberOption(Option => 
                    Option.setName("nota")
                    .setDescription("Coloque uma nota para loja.")
                    .setMaxValue(5)
                    .setMinValue(1)
                    .setRequired(true)),

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async execute(client, interaction) {
        try {
            const textoRecb = interaction.options.getString("texto");
            const nota = interaction.options.getNumber("nota")
            const cargo = "1095710819775430676"
            const canal = interaction.guild.channels.cache.get("712254173164601345")
            const roles = interaction.guild.roles.cache.get(cargo)
            if(interaction.member.roles.cache.some(role=> role.id === roles.id)){
                const embed = new EmbedBuilder()
                .setAuthor({name: interaction.user.tag, iconURL:interaction.user.avatarURL({dynamic:true})})
                .setTitle("Sistema de Avaliação")
                .setFields([
                    {name: `${'⭐'.repeat(nota)}`,
                    value: `\`\`\`${textoRecb}\`\`\``
                    }
                ])
                .setColor("Red")
                .setThumbnail(interaction.user.avatarURL({dynamic: true}))
                .setTimestamp()
                .setURL("https://www.twitch.tv/gabrielgomesbrg")
                .setFooter({text: `${interaction.guild.name} - ©Todos os Direitos Resevados `, iconURL: interaction.guild.iconURL({dynamic: true})})

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
                            console.log(`Erro ao conectar na database, avaliar ${err}`);
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

                Connection.query(`INSERT INTO avaliacoes(Nome, id_discord, Link_foto, descricao, Gmail) VALUES ('${interaction.user.username}','${interaction.user.id}','${interaction.user.avatarURL()}','${textoRecb}','none')`, (err, response)=>{
                    if(err) return console.error("Erro no sistema de avaliação: " + err)
                    if(response){
                        canal.send({embeds: [embed], content: `${interaction.user}`})
                        interaction.reply({content: `**✔ | ${interaction.user}, sua avaliação foi enviada com sucesso.`, ephemeral:true})
                    }else{
                        interaction.reply({content: `**⚠ | Aconteceu algo inesperado**`, ephemeral: true})
                    }
                })
                
            }else{
                const embedA = new EmbedBuilder()
                .setDescription(`**❌ | ${interaction.user}, você precisa ser cliente para fazer uma avalição para loja. **`)
                .setColor("Red")
                interaction.reply({embeds:[embedA], ephemeral:true})
            }

        } catch (err) {
            console.error(err)
            return
        }
    }
}