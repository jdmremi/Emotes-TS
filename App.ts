import { Client, Collection, Message } from "discord.js"

import fs from "fs"
import "dotenv/config"

let commandFiles: string[] = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
let client: Client = new Client();

let commands = new Map();

for(var _cmd of commandFiles) {
    // Needs to be fixed. Doesn't set the aliases or the command.
    let command = require(`./commands/${_cmd}`).default;
    commands.set(command.name, {
        aliases: command.aliases,
        command: command
    });
}

client.on('ready', () => {
    import("./listeners/Ready").then((e) => e.run(client));
});

client.on('message', async(message: Message) => {
    import("./listeners/Message").then((e) => e.run(message, commands));
});

client.login(process.env.token);