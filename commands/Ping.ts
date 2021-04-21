import ICommand from "../interfaces/ICommand";
import { Message } from "discord.js";

export default class Ping implements ICommand {
    cmdName: string = "Ping";
    usage: string = "";
    description: string = "Pings the bot";
    aliases: string[] = [];
    args: boolean = false;
    needsArgs: boolean = false;
    adminOnly: boolean = false;
    WIP: boolean = false;

    async run(message: Message, args: string[]) {
        let sent = await message.channel.send("Pong!");
        let ping = sent.createdTimestamp - message.createdTimestamp;
        return await sent.edit(`Pong! Latency is ${ping}ms.`);
        
    }

}