import ICommand from "../../shared/interfaces/ICommand";
import { Message } from "discord.js";

export default class Ping implements ICommand {
    public readonly cmdName: string = "Ping";
    public readonly usage: string = "";
    public readonly description: string = "Pings the bot";
    public readonly aliases: string[] = [];
    public readonly args: boolean = false;
    public readonly needsArgs: boolean = false;
    public readonly adminOnly: boolean = false;
    public readonly WIP: boolean = false;

    public async run(message: Message, args: string[]) {
        let sent = await message.channel.send("Pong!");
        let ping: number = sent.createdTimestamp - message.createdTimestamp;
        return await sent.edit(`Pong! Latency is ${ping}ms.`);
    }

}