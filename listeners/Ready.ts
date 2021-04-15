import { Client } from "discord.js";

export default async function RunReady(client: Client) {
    console.log(`Logged in as ${client.user?.tag}`);
}