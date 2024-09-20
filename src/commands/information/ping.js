
module.exports = {
    name: "ping",

    description: "Comando para ver la latencia del bot",

    slash(client, int) {

        int.reply({ content: `El ping del bot es ${client.ws.ping} ms` });

    }
}