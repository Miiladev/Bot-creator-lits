const humanizeDuration = require('humanize-duration');

const { db_info } = require("../../functions/saved");
const { paginacion } = require("../../functions/pagination");

module.exports = {
    name: "user-info",
    description: "Comando para ver tu informacion",
    options: [
        { name: "usuario", description: "Menciona al usuario.", type: 6, require: false },
    ],

    async slash(client, int) {

        const { options, user, member } = int;

        const users = options.getUser("usuario") || int.user;

        const userget = await db_info(users.id);

        if (!userget) return int.reply({ content: `❌ Este usuario no se encuentra en la base de datos.`, ephemeral: true });

        const userPerms = member.permissions;

        if (userPerms.has("Administrator")) {

            const servers = userget.servers;

            const serverInfo = servers.map(server => {

                const timeRemaining = server.time.msCurrent - Date.now();

                const timeDisplay = timeRemaining > 0
                    ? `Tiempo: 🟢 \`${humanizeDuration(timeRemaining, { language: "es", units: ["d", "h", "m", "s"], round: true })}\``
                    : 'Tiempo: 🔴 \`Servicio caducado\` 🔴';

                return `**Producto:** \`${server.product}\`\n**${timeDisplay}**\n**Nodo:** \`${server.node}\`\n**Precio:** \`${server.price}\` \n**Identificador:** \`${server.identifier}\`\n**UID:** \`${server.uid}\`\n`;
            });

            return paginacion(client, int, serverInfo, `Servicios de ${users.tag}`, `**Total de servicios:** \`${servers.length}\`\n\n`, 3);

        }

        if (int.user.id !== users.id) return int.reply({ content: "Solo puedes ver tu informacion." })

        if (users.id == int.user.id) {

            const servers = userget.servers;

            const serverInfo = servers.map(server => {

                const timeRemaining = server.time.msCurrent - Date.now();

                const timeDisplay = timeRemaining > 0
                    ? `**Tiempo:** 🟢 \`${humanizeDuration(timeRemaining, { language: "es", units: ["d", "h", "m", "s"], round: true })}\``
                    : '**Tiempo:** 🔴 \`Servicio caducado\` 🔴';

                return `**Producto:** \`${server.product}\`\n**Identificador:** \`${server.identifier}\`\n**Nodo:** \`${server.node}\`\n**Precio:** \`${server.price}\`\n${timeDisplay}\n`;
            });

            int.reply({ content: `Las estadisticas del usuario ${user} fueron enviadas correctamente`, ephemeral: true })

            paginacion(client, int, serverInfo, `Servicios de ${users.tag}`, `**Total de servicios:** \`${servers.length}\`\n\n`, 3);

        }


    }
}