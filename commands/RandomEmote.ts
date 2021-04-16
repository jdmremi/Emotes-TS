import ICommand from "../interfaces/ICommand";
import { Message } from "discord.js";
import Database from "../internal/Database";

export default class RandomEmote implements ICommand {
    cmdName: string = "Random";
    usage: string = "[name]";
    description: string = "Sends a random emote. Query optional.";
    aliases: string[] = ["randomemote"];
    args: boolean = false;
    needsArgs: boolean = false;
    adminOnly: boolean = false;
    WIP: boolean = false;

    async run(message: Message, args: string[]) {
        // Get file from disk and send.
        let randomEmote = await Database.getRandom();
        await message.channel.send(randomEmote[0].name);
    }

}