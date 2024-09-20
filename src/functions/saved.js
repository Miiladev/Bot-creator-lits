const ms = require('ms');
const MegaDB = require('megadb');
const plans = new MegaDB.crearDB('hostings');
const humanizeDuration = require("humanize-duration");

async function saved(userId) {
    const Guardado = await plans.get(`${userId}`);
    if (!Guardado) await plans.set(`${userId}`, { servers: [] });
}

async function db_info(userId) {
    const data = await plans.get(`${userId}`);
    return data;
}

async function upgrate(user, node, time, product, identifier, supplier, note, price, uid) {

    const timeMs = ms(time);
    const timeCurrent = Math.round(Date.now() + Number(timeMs))

    const newEntry = {
        userID: user,
        node: node,
        price: price,
        time: { ms: timeMs, msCurrent: timeCurrent },
        product: product,
        identifier: identifier,
        supplier: supplier || '',
        note: note || '',
        uid: uid
    };

    const userData = await plans.get(`${user}`) || { servers: [] };
    userData.servers.push(newEntry);
    await plans.set(user, userData);
}

async function delete_user(uid) {
    const keys = await plans.keys();

    for (const key of keys) {
        const userData = await plans.get(key);
        const updatedServers = userData.servers.filter(server => server.uid !== uid);

        if (updatedServers.length !== userData.servers.length) {
            userData.servers = updatedServers;
            await plans.set(key, userData);
        }
    }

}

async function renew_service(uid, newTime) {

    let result = "";

    const timeMs = ms(newTime);
    const currentTime = Date.now();

    const keys = await plans.keys();

    for (const key of keys) {

        const userData = await plans.get(key);

        const serverToUpdate = userData.servers.find(server => server.uid === uid);

        if (serverToUpdate) {

            const remainingTime = serverToUpdate.time.msCurrent - currentTime;

            if (remainingTime > 0) {

                const newExpirationTime = serverToUpdate.time.msCurrent + timeMs;
                serverToUpdate.time.msCurrent = newExpirationTime;
                serverToUpdate.time.ms += timeMs;

            } else serverToUpdate.time = { ms: timeMs, msCurrent: currentTime + timeMs };

            await plans.set(key, userData);

            return result = "success";
        }
    }

}

async function db_service() {

    const keys = await plans.keys();
    const serverInfo = [];

    for (const key of keys) {
        const userData = await plans.get(key);
        if (!userData || !userData.servers) continue;

        const expiredServers = userData.servers.filter(server => { return typeof server.time.msCurrent !== "undefined" && server.time.msCurrent < Date.now(); });

        const soonToExpireServers = userData.servers.filter(server => { return typeof server.time.msCurrent !== "undefined" && server.time.msCurrent >= Date.now() && server.time.msCurrent <= Date.now() + 3 * 24 * 60 * 60 * 1000; });

        const totalServers = userData.servers.length;

        serverInfo.push({
            userId: key,
            expiredCount: expiredServers.length,
            soonToExpireCount: soonToExpireServers.length,
            totalServers: totalServers,
            userTag: `${key}`
        });
    }

    return serverInfo.map(user =>
        `**Usuario:** <@!${user.userTag}> - \`${user.userId}\`\n` +
        `**Servidores caducados:** ${user.expiredCount} ☠️\n` +
        `**Servidores por caducar en 3 días:** ${user.soonToExpireCount} ⏳\n` +
        `**Total de servidores:** \`${user.totalServers}\`\n\n`
    )

}


module.exports = { saved, db_info, upgrate, delete_user, renew_service, db_service };