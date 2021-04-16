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
        return await message.channel.send("Pong!");
    }

}