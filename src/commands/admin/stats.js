const { db_service } = require("../../functions/saved");
const { paginacion } = require("../../functions/pagination");

module.exports = {
    name: "stats",
    description: "Comando para ver los stats de los servicios",

    slash: async (client, int) => {

        const { member } = int;
        const userPerms = member.permissions;

        if (!userPerms.has("Administrator")) return int.reply({ content: "❌ No tienes permisos suficientes para usar este comando.", ephemeral: true });

        const service = await db_service();

        if (!service.length) return int.reply({ content: "No hay datos de servicios disponibles.", ephemeral: true });

        return paginacion(client, int, service, "24RACKS CLOUD", "\n", 3);
    }
};
