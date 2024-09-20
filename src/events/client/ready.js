
module.exports = {
    once: false,

    async events(client) {

        const slash = await client.commands.map(items => items);
        await client.application.commands.set(slash);

        client.user.setPresence({
            activities: [{ name: `Apoyando a la comunidad.` }],
            status: "dnd"
        });

        console.log(`El bot ${client.user.username} esta funcionando corrrectamente.`);

    }
}