const { EmbedBuilder } = require("@discordjs/builders");
const { saved, upgrate } = require("../../functions/saved");
const { v4: uuidv4 } = require('uuid');

module.exports = {
    name: "create",
    description: "Comando para crear el servicio",
    options: [
        { name: "titular", description: "Id del titular (discord id)", type: 3, require: true },
        {
            name: "nodo", description: "Nodo", type: 3, require: true,
            choices: [
                { name: "24RCS03", value: "24RCS03" },
                { name: "24RCS06", value: "24RCS06" },
                { name: "MIA01", value: "MIA01" }
            ]
        },
        { name: "tiempo", description: "Menciona el tiempo del servicio (30d)", type: 3, require: true },
        { name: "producto", description: "Nombre del producto", type: 3, require: true },
        { name: "identificador", description: "Menciona al usuario", type: 3, require: true },
        { name: "precio", description: "Menciona el precio del servicio", type: 3, require: true },
        { name: "proveedor", description: "Menciona al proveedor", type: 3, require: false },
        { name: "anotaciones", description: "Menciona al usuario", type: 3, require: false }
    ],

    async slash(client, int) {

        const { options, member } = int;
        const user = options.getString("titular");
        const node = options.getString("nodo");
        const time = options.getString("tiempo");
        const product = options.getString("producto");
        const identifier = options.getString("identificador");
        const price = options.getString("precio");

        const supplier = options.getString("proveedor");
        const note = options.getString("anotaciones");

        const userPerms = member.permissions;

        if (!userPerms.has("Administrator")) return int.reply({ content: "❌ No tienes permisos suficientes para usar este comando.", ephemeral: true });

        await saved(user);

        int.channel.send({ content: "El servicio se regristro correctamente." });

        const uid = uuidv4();

        const embed = new EmbedBuilder()
            .setTitle(int.guild.name)
            .setColor(1752220)
            .setThumbnail(int.guild.iconURL({ size: 1024, dynamic: true, force: true, extension: 'png' }))
            .addFields([
                { name: "Usuario", value: `<@!${user}> - ${user}`, inline: false },
                { name: "Nodo", value: node, inline: true },
                { name: "Tiempo", value: time, inline: true },
                { name: "Producto", value: product, inline: true },
                { name: "Identificador", value: identifier, inline: true },
                { name: "Precio", value: `${price}`, inline: true },
                { name: "UID", value: uid, inline: true }
            ])

        if (supplier) embed.addFields([{ name: "Provedor", value: supplier, inline: true }]);
        if (note) embed.addFields([{ name: "Anotaciones", value: note, inline: false }]);

        await upgrate(user, node, time, product, identifier, supplier, note, price, uid);

        int.reply({ embeds: [embed], ephemeral: true });


    }
}