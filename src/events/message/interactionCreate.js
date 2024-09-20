
module.exports = {
    once: false,

    events(client, interaction) {

        if (!interaction.isChatInputCommand()) return;

        const cmd = client.commands.get(interaction.commandName);

        if (cmd) cmd.slash(client, interaction); else return;

    }
}