import { Client, Interaction, Message } from "discord.js"

import fs from "fs"
import "dotenv/config"

import RunMessage from "./listeners/Message"
import RunReady from "./listeners/Ready"
import ICommand from "../shared/interfaces/ICommand"
import Commands from "../shared/internal/discord/Commands"
import RunInteractionCreate from "./listeners/InteractionCreate"
import { config } from "dotenv"
import { Directories } from "../shared/enums/Directories"

config({
    path: Directories.Home + ".env"
});

const commandFiles: string[] = fs.readdirSync('./commands')
    .filter((file: string) => file.endsWith('.ts'));

const client: Client = new Client({
    intents: ["DIRECT_MESSAGES", "GUILD_MESSAGES", "GUILD_EMOJIS_AND_STICKERS", "GUILDS", "GUILD_MEMBERS"],
    presence: {
        status: "dnd",
        activities: [{
            name: "..help for more info",
            type: "PLAYING",
        }]
    }
});

const commands: Commands = new Commands();

commandFiles.forEach((cmd) => {
    import(`./commands/${cmd}`).then((c) => {
        const command: ICommand = new c.default();
        commands.add(command);
    });
});

client.on("ready", async () => {
    RunReady(client);
});

client.on("messageCreate", async (message: Message) => {
    RunMessage(message, commands);
});

client.on("interactionCreate", async (interaction: Interaction) => {
    RunInteractionCreate(interaction);
});

client.login(process.env.token);