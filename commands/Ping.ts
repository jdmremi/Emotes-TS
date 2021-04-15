import ICommand from "../interfaces/ICommand";
import { Message } from "discord.js";

export default class Ping implements ICommand {
    static cmdName: string = "Ping";
    static usage: string = "";
    static description: string = "Pings the bot";
    static aliases: string[] = ["Ping", "ping"];
    static args: boolean = false;
    static needsArgs: boolean = false;
    static adminOnly: boolean = false;
    static WIP: boolean = false;
    
    static async run(message: Message) {
        return await message.channel.send("Pong!");
    }

}