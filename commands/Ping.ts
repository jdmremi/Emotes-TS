import ICommand from "../interfaces/ICommand";
import { Message } from "discord.js";

export default class Ping implements ICommand {
    name: string = "Ping";
    usage: string = "";
    description: string = "Pings the bot";
    aliases: string[] = ["Ping", "ping"];
    args: boolean = false;
    
    static async run(message: Message) {
        return await message.channel.send("Pong!");
    }

}