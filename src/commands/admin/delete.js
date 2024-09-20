const { delete_user } = require("../../functions/saved");

module.exports = {
    name: "delete",
    description: "Comando para eliminar el servicio",
    options: [
        { name: "uid", description: "UID del titular", type: 3, require: true }
    ],

    async slash(client, int) {

        const { options, member } = int;
        const userPerms = member.permission

        const uid = options.getString("uid");

        if (!userPerms.has("Administrator")) return int.reply({ content: "❌ No tienes permisos suficientes para usar este comando.", ephemeral: true });

        const success = await delete_user(uid);

        if (!success) return int.reply({ content: `No mencionaste una UID valida.` });

        int.reply({ content: `El servicio se elimino correctamente.` });

    }
}