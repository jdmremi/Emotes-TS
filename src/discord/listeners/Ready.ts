import { Client } from "discord.js";

export default function RunReady(client: Client) {
    console.log(`Logged in as ${client.user?.tag}`);
}