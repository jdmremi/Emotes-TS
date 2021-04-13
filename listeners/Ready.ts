import { Client } from "discord.js";

export function run(client: Client): void {
    console.log(`Logged in as ${client.user?.tag}`);
}