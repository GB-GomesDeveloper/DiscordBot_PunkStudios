const { SlashCommandBuilder, CommandInteraction, Client, PermissionFlagsBits, EmbedBuilder, SelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ativar_sistema_ticket")
    .setDescription("Esse comando serve para ativar o sistema de ticket.")
    .addChannelOption(Option => Option.setName("canal")
    .setDescription("Mencione o canal que deseja ativar o ticket.")
    .setRequired(true)),

/**
 * @param {CommandInteraction} interaction 
 * @param {Client} client 
 */

    async execute(client, interaction){
        if(!interaction.user.id == "704425386007724034"){
            const embed = new EmbedBuilder()
                .setDescription(`**❌ | ${interaction.user}, você não tem permissão para executar esse comando.**`)
                .setColor("Red")
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }
        const Ano = new Date().getFullYear()
        const canal = interaction.options.getChannel("canal")
        try{

            const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("Ticket_Category")
            .setPlaceholder("Selecione uma categoria")
            .addOptions([
                {
                    label: "Suporte",
                    emoji: "<:canais:788087583766478859>",
                    value: "Suporte"     
                  },
                  {
                    label: "Dúvidas",
                    emoji: "<:canais:788087583766478859>",
                    value: "Dúvidas"     
                  },
                  {
                    label: "Ecomenda de Scripts",
                    emoji: "<:canais:788087583766478859>",
                    value: "Ecomenda de Scripts"     
                  },
                  {
                    label: "Orçamento de Site",
                    emoji: "<:canais:788087583766478859>",
                    value: "Orçamento de Site"     
                  },
                  {
                    label: "Reportar Bug",
                    emoji: "<:canais:788087583766478859>",
                    value: "Reportar Bug" 
                  },
                  {
                    label: "Orçamendo de Bots",
                    emoji: "<:canais:788087583766478859>",
                    value: "Orçamendo de Bots"     
                  },
                  {
                    label: "Suporte de Modelagem",
                    emoji: "<:canais:788087583766478859>",
                    value: "Suporte de Modelagem"     
                  },
                  {
                    label: "Reportar Bug de Modelagem",
                    emoji: "<:canais:788087583766478859>",
                    value: "Reportar Bug de Modelagem"     
                  },
                  {
                    label: "Orçamento de Modelagem",
                    emoji: "<:canais:788087583766478859>",
                    value: "Orçamento de Modelagem"     
                  },
                  {
                    label: "Outros",
                    emoji: "<:canais:788087583766478859>",
                    value: "Outros"     
                  },
            ])
            const selectMenuRow = new ActionRowBuilder()
            .addComponents(selectMenu)

            const embed = new EmbedBuilder()
            .setAuthor({name: "Punk Studios No Topo", iconURL: client.user.avatarURL({dynamic: true})})
            .setTitle("Sistema Ticket !")
            .setDescription(`> 🆘 | **Escolha uma categoria para falar com nossa equipe**

            > 🎭 | **Cuidado com quem você adiciona no ticket**
            
            > 📆 | **Revisem nossa ${interaction.guild.channels.cache.get("1003018080311586826")} para serem atendidos.**`)
            .setThumbnail(interaction.guild.iconURL({dynamic: true}))
            .setURL("https://www.twitch.tv/gabrielgomesbrg")
            .setFooter({text: `${interaction.guild.name} ~ Copyright © ${Ano}`, iconURL: interaction.guild.iconURL({dynamic: true})})

             canal.send({embeds: [embed], components: [selectMenuRow]}).then(msg => {
                return interaction.reply({content: `**✔️ | ${interaction.user}, Sistema de ticket ativado com sucesso.**`, ephemeral: true})
             })
        }catch(err){
            console.log("Erro_Ativação_Ticket: " + err) 
            return interaction.reply({content: `❌ | ${interaction.user}, aconteceu algo inesperado.`, ephemeral: true});
        }
    }
}