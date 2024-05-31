const { GuildMember, Client, AttachmentBuilder } = require("discord.js");
const Canvas = require("@napi-rs/canvas");
const { request } = require("undici");

// Utilize um conjunto para armazenar IDs dos membros já processados
const processedMembers = new Set();

module.exports = {
  name: "guildMemberAdd",

  /**
   * @param {GuildMember} member 
   * @param {Client} client 
   */
  async execute(member, client) {
    // Verifica se o membro já foi processado
    if (processedMembers.has(member.id)) {
      return;
    }

    // Adiciona o ID do membro ao conjunto para evitar processamento duplicado
    processedMembers.add(member.id);

    // Cria a imagem de boas-vindas
    const canvas = await createWelcomeImage(member);
    
    // Converte a imagem para um Buffer
    const imageBuffer = await canvas.encode("png");

    // Cria o anexo
    const attachment = new AttachmentBuilder(imageBuffer, { name: "Bem_vindo.png" });

    // Envia a mensagem de boas-vindas com a imagem para o canal específico
    const channel = client.channels.cache.get("1171935763592663190");
    const roles = member.guild.roles.cache.get("718939732595441770");

    // Adiciona um papel (role) específico ao novo membro
    member.roles.add(roles);

    // Envia a mensagem de boas-vindas mencionando o novo membro e anexa a imagem gerada
    channel.send({ files: [attachment], content: `<:punk:758077275932721182> Seja bem-vindo ${member.user}` });
  }
};

/**
 * Cria a imagem de boas-vindas com máscara e texto.
 * @param {GuildMember} member
 * @returns {Canvas} - Instância do Canvas com a imagem gerada.
 */
async function createWelcomeImage(member) {

  const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage("./util/img/Background.png");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Define a cor do texto e o estilo da fonte
    ctx.fillStyle = '#ffffff';
    ctx.font = '30px Arial';

    // Configurações de alinhamento do texto
    // ctx.textAlign = 'center';
    // ctx.textBaseline = 'middle';

    // Desenha o texto no centro da imagem
    const text = member.user.tag;
    const xf = 237;
    const yf = 78.8;
    ctx.fillText(text.slice(0, 12), xf, yf);

    const radius = 31; // Raio desejado
    const x = 34; // Posição X da imagem
    const y = 48.8; // Posição Y da imagem
    const width = 179; // Largura da imagem
    const height = 159; // Altura da imagem
    // Crie a máscara de canto
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    // Defina a máscara como um recorte
    ctx.clip();
    const { body } = await request(member.user.displayAvatarURL({ extension: 'jpg' }));
    const avatarMember = await Canvas.loadImage(await body.arrayBuffer());
    ctx.drawImage(avatarMember, x, y, width, height);


    // Converte a imagem para um Buffer
    return canvas;

}
