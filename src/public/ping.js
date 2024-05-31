const { EmbedBuilder, Client, CommandInteraction, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Esse comando serve para ver a latência do bot !"),

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        let pingreserver = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`**<a:3915donotdisturb:1005445537966862449>  ${interaction.user}, aguarde estou buscando informações !**`)
        interaction.reply({ embeds: [pingreserver], ephemeral: true })

        setTimeout(() => {
            let ping = new EmbedBuilder()
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setTitle(`Latência do ${client.user.username} !`)
                .setDescription(`**<a:AllianceGIF:806259248010362920> ${interaction.user}, aqui você verá minha latência e da minha ApI ! **`)
                .addFields(
                    { name: "<a:7811partyrobotd:1005446089907904612> Minha latência ➔", value: `${Date.now() - interaction.createdTimestamp}Ms` },
                    { name: "<a:2259gearsloading:1005446107117142116> Minha ApI ➔", value: `${Math.round(client.ws.ping)}Ms` }
                )
                .setColor("Red")
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setTimestamp()
                .setURL("https://github.com/ItaChiGabriel")
                .setFooter({text: `${interaction.guild.name} - ©Todos os Direitos Resevados `, iconURL: interaction.guild.iconURL({dynamic: true})})
            interaction.editReply({ embeds: [ping], ephemeral: true })

        }, 8000)
    }
}