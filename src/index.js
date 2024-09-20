const { Client, GatewayIntentBits, Collection, Partials } = require("discord.js");

const { User, Channel, Message } = Partials;
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.DirectMessagePolls],
    partials: [User, Channel, Message],
    allowedMentions: { parse: ["users", "roles"] }
});

require("./require")(client, Collection);