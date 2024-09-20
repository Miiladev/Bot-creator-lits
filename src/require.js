const PROCESS = process.env;

module.exports = (client, Collection) => {

    client.commands = new Collection();

    const files = ["utils"];

    files.forEach(elements => { require(`./functions/${elements}`)(client); console.log(`[ARCHIVO] ${elements} ha sido cargado!`) });

    process.on('unhandledRejection', (err) => { console.error(err); });

    client.login(PROCESS.BOT_TOKEN);

}