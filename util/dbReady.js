const {host, user, password, dbName } = require("../Security/db/DadosI.json")

const dados = {
    hostdb: host,
    userdb: user,
    passwordDB: password,
    databasedb: dbName,
    charsetdb: "utf8mb4"
}

module.exports = dados;