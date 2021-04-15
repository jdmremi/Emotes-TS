import { Client, Collection, Message } from "discord.js"

import fs from "fs"
import "dotenv/config"

import RunMessage from './listeners/Message'
import RunReady from './listeners/Ready'

let commandFiles: string[] = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
let client: Client = new Client();

let commands = new Map();

for(var _cmd of commandFiles) {

    import(`./commands/${_cmd}`).then((c) => {
        let command = c.default;
        commands.set(command.cmdName.toLowerCase(), {
            aliases: command.aliases,
            command: command
        });
    });
}

client.on('ready', async() => {
    await RunReady(client);
});

client.on('message', async(message: Message) => {
    await RunMessage(message, commands);
});

client.login(process.env.token);