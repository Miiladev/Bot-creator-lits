const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ComponentType } = require("discord.js");

async function paginacion(client, int, text, title = '24RACKS CLOUD', footer, elements = 3) {

    const embeds = [];
    for (let i = 0; i < text.length; i += elements) {
        let desc = text.slice(i, i + elements);
        embeds.push(new EmbedBuilder()
            .setTitle(title)
            .setDescription(footer + desc.join('\n '))
            .setColor(3447003)
            .setThumbnail(int.guild.iconURL({ dynamic: true })));
    }

    if (embeds.length === 1) return int.reply({ embeds: [embeds[0]], ephemeral: true }).catch(() => { });

    let paguesCurrent = 0;
    const buttons = ['⪻', '⮔', '⪼'].map((label, index) =>
        new ButtonBuilder().setStyle(index === 1 ? 'Success' : 'Primary').setCustomId(label).setLabel(label)
    );

    const embedMessage = await int.reply({
        embeds: [embeds[paguesCurrent].setFooter({ text: `Pagina ${paguesCurrent + 1} / ${embeds.length}` })],
        components: [new ActionRowBuilder().addComponents(buttons)], ephemeral: true
    });

    const filter = i => i.user.id === int.user.id;
    const collector = embedMessage.createMessageComponentCollector({ ComponentType: ComponentType.Button, filter, time: 180e3 });

    collector.on('collect', async b => {

        collector.resetTimer();
        const action = b.customId;

        paguesCurrent = action === '⪻' ? (paguesCurrent === 0 ? embeds.length - 1 : paguesCurrent - 1) : action === '⮔' ? 0 : (paguesCurrent + 1) % embeds.length;

        await b.deferUpdate();

        b.editReply({
            embeds: [embeds[paguesCurrent].setFooter({ text: `Pagina ${paguesCurrent + 1} / ${embeds.length}` })],
            components: [new ActionRowBuilder().addComponents(buttons)]
        }).catch(() => { });

    });

    collector.on('end', () => {
        
        try { embedMessage.components[0].components.map((boton) => (boton.disabled = true)) } catch (error) { }
        embedMessage.edit({
            embeds: [embeds[paguesCurrent].setFooter({ text: `Pagina ${paguesCurrent + 1} / ${embeds.length}` })],
            components: []
        }).catch(() => { });
    });
}

module.exports = { paginacion };