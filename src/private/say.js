const { SlashCommandBuilder, Client, CommandInteraction, PermissionFlagsBits, EmbedBuilder, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Esse comando serve para o bot escrever algo.")
    .addStringOption(Option => 
        Option.setName("escreva_algo")
        .setDescription("Escreva alguma coisa para o bot enviar.")
    .setRequired(true))
    .addChannelOption(Option => 
        Option.setName("canal")
        .addChannelTypes(ChannelType.GuildText)
        .setDescription("Escolha um canal de texto para enviar a mensagem")
        .setRequired(true)),

/**
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */

    async execute(client, interaction){

        if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)){
            const embed = new EmbedBuilder()
            .setDescription(`**❌ | ${interaction.user}, você não tem permissão para executar esse comando.**`)
            .setColor("Red")
           return interaction.reply({embeds: [embed], ephemeral: true})
        }

        const canal = interaction.options.getChannel("canal")
        const texto = interaction.options.getString("escreva_algo")

        canal.send(texto)
        interaction.reply({content: `**✔ | ${interaction.user}, mensagem enviada com sucesso !**`, ephemeral: true});
   
    }
}