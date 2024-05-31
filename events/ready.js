const { Client, ActivityType} = require("discord.js");
const mysql = require("mysql2")
const { hostdb, userdb, passwordDB, databasedb, charsetdb } = require("../util/dbBase_dados_Ready")
const { ContadorClient_ChannelID } = require("../Security/Config/informacoes")

module.exports = {
    name: "ready",
    /**
     * @param {Client} client 
     */
    async execute(client) {
        const Status = ["Punk Studios No Topo ✨", "Oferecemos Melhores Produtos 📦", "Suporte Especializado 🎧", "Acesse Agora O Nosso Site 🔗", "Os Melhores Preços Você Encontra Aqui 💲"]
        let i = 0
        setInterval(() => {
            client.user.setPresence({
                activities: [{
                    name: `${Status[i++ % Status.length]}`,
                    type: ActivityType.Playing,
                }],
                status: "idle"
            })
        }, 20000)

        // List Clients 

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
                    console.log(`Erro ao conectar na database, proteção ${err}`);
                    setTimeout(bancodedados, 2000);
                } else {
                    console.log(`Sistema de Contagem OK!`)

                }
            });

            Connection.on('error', function (err) {
                console.log('database erro RESET...');
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    return
                } else {
                    // throw err;                                  
                }
            });
        }

        DbConnectReady()

        const channelContador = client.channels.cache.get(ContadorClient_ChannelID);

        Connection.query("SELECT * FROM punkprotecao ORDER by id DESC limit 1", (err, response) => {
            if (err) return;
            if (response) {
                setInterval(() => {
                    channelContador.setName(`【🌐】Clientes⌈${response[0].id}⌋`)
                }, 20000)
            }
        })
    }
}