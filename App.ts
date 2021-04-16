import { Client, Message } from "discord.js"

import fs from "fs"
import "dotenv/config"

import RunMessage from './listeners/Message'
import RunReady from './listeners/Ready'
import ICommand from "./interfaces/ICommand"
import CommandMap from "./internal/CommandMap"

const commandFiles: string[] = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
const client: Client = new Client();
const commands: CommandMap = new CommandMap();

commandFiles.forEach((cmd) => {
    import(`./commands/${cmd}`).then((c) => {
        const command: ICommand = new c.default();
        commands.add(command);
    });
});

client.on('ready', async () => {
    RunReady(client);
});

client.on('message', async (message: Message) => {
    RunMessage(message, commands);
});

client.login(process.env.token);