const { SlashCommandBuilder, ChannelType, Client, CommandInteraction, PermissionsBitField, PermissionFlagsBits, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("embed")
        .setDescription("Esse comando serve para criar embeds do seu jeito.")
        .addChannelOption(Option => Option.setName("canal")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
            .setDescription("Escolha um canal para enviar a embed")
        ),

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const embed = new EmbedBuilder()
                .setDescription(`**❌ | ${interaction.user}, você não tem permissão para executar esse comando.**`)
                .setColor("Red")
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }
        try {
            const canal = interaction.options.getChannel("canal")

            const modal = new ModalBuilder()
                .setCustomId("Modal_Embed")
                .setTitle("Configurações Embed")

            const InputTitleEmbed = new TextInputBuilder()
                .setCustomId("TitleEmbed")
                .setLabel("Qual é o titulo da embed ?")
                .setPlaceholder("Titulo")
                .setStyle(TextInputStyle.Short)

            const InputDescriptonEmbed = new TextInputBuilder()
                .setCustomId("DescriptionEmbed")
                .setLabel("Qual é a descrição da embed ?")
                .setPlaceholder("Descrição")
                .setStyle(TextInputStyle.Paragraph)

            const InputColorEmbed = new TextInputBuilder()
                .setCustomId("ColorEmbed")
                .setLabel("Qual é a cor da embed ?")
                .setPlaceholder("Hex | nome(Em inglês)")
                .setStyle(TextInputStyle.Short)

            const InputImagemURL = new TextInputBuilder()
                .setCustomId("ImagemURL")
                .setLabel("Qual é a imagem da embed ?")
                .setRequired(false)
                .setPlaceholder("URL da Imagem")
                .setStyle(TextInputStyle.Short)

            const TitleEmbed = new ActionRowBuilder().addComponents(InputTitleEmbed);
            const DescriptionEmbed = new ActionRowBuilder().addComponents(InputDescriptonEmbed);
            const ColorEmbed = new ActionRowBuilder().addComponents(InputColorEmbed);
            const ImagemURL = new ActionRowBuilder().addComponents(InputImagemURL);

            modal.addComponents(TitleEmbed, DescriptionEmbed, ColorEmbed, ImagemURL);
            await interaction.showModal(modal)
            await interaction.awaitModalSubmit({
                time: 3600000,
                filter: i => i.user.id === interaction.user.id,
            })
                .catch(err => {
                    console.error("Aconteceu Algo no sitema de Embed: " + err);
                    return interaction.reply({ content: `**❌ | ${interaction.user}, seu tempo acabou ou aconteceu algum erro.**` })
                })
                .then(async response => {

                    if(interaction.deferred){
                        return;
                    }
                    try{
                        let titulo = response.fields.getTextInputValue("TitleEmbed")
                        if (titulo == undefined)  titulo = null;
    
                        let descricao = response.fields.getTextInputValue("DescriptionEmbed")
                        if (descricao == undefined)  descricao = null;
    
                        let color = response.fields.getTextInputValue("ColorEmbed")
                        if (color == undefined)  color = null;
    
                        let imagem = response.fields.getTextInputValue("ImagemURL")
                        if (!imagem.includes("https://")) imagem = null
                        if (imagem == undefined)  imagem = null;
    
                        const EmbedCriada = new EmbedBuilder()
                            .setTitle(titulo)
                            .setDescription(descricao)
                            .setColor(color)
                            .setImage(imagem)
                            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                            .setTimestamp()
                            .setURL("https://www.twitch.tv/gabrielgomesbrg")
                            .setFooter({text: `${interaction.guild.name} - ©Todos os Direitos Resevados `, iconURL: interaction.guild.iconURL({dynamic: true})})
                     canal.send({ embeds: [EmbedCriada] }).then(Embed => {
                            response.reply({ content: `**✔ | ${interaction.user}, embed criada com sucesso !**`, ephemeral: true })
                        })
                    }catch(err){
                        console.error("Aconteceu Algo no sitema de Embed: " + err);
                    return interaction.reply({ content: `**❌ | ${interaction.user}, aconteceu Algo no sitema de Embed**` })
                    }
                })
        } catch (err) {
            console.error(err);
        }
    }
}