const { readdirSync } = require("node:fs");

module.exports = (client) => {

    readdirSync("./src/events").forEach((folder) => {

        const event = readdirSync(`./src/events/${folder}`).filter((file) => file.endsWith(".js"));

        event.forEach((elements) => {

            const event_name = elements.slice(0, -3);
            const events = require(`../events/${folder}/${elements}`);

            if (events.on) client.once(event_name, (...args) => events.events(client, ...args));
            else client.on(event_name, (...args) => events.events(client, ...args));

            console.log(`[EVENTO] ${event_name} ha sido cargado!`);

        });
    });

    readdirSync("./src/commands").forEach(async (folder) => {

        await client.commands.clear();
        const command = readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith(".js"));

        command.forEach((elements) => {

            const commands_name = elements.slice(0, -3);
            const commands = require(`../commands/${folder}/${elements}`);

            client.commands.set(commands.name.toLowerCase(), commands);
            console.log(`[COMANDO] ${commands_name} ha sido cargado!`);

        });

    });

}