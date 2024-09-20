const { renew_service } = require("../../functions/saved");

module.exports = {
    name: "renew",
    description: "Comando para renovar el servicio",
    options: [
        { name: "uid", description: "UID del titular", type: 3, required: true },
        { name: "time", description: "El tiempo que será renovado (por defecto 30d)", type: 3, required: false }
    ],

    async slash(client, int) {

        const { options, member } = int;
        const userPerms = member.permissions;

        const uid = options.getString("uid");
        const time = options.getString("time") || "30d";

        if (!userPerms.has("Administrator")) return int.reply({ content: "❌ No tienes permisos suficientes para usar este comando.", ephemeral: true });

        const success = await renew_service(uid, time);

        if (!success) return int.reply({ content: `❌ No se encontró ningún servicio con UID \`${uid}\`.`, ephemeral: true });

        return int.reply({ content: `✅ El servicio con UID \`${uid}\` ha sido renovado correctamente con un tiempo adicional de \`${time}\`.`, ephemeral: true });

    }
}
