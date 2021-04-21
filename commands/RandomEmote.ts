import ICommand from "../interfaces/ICommand";
import { Message } from "discord.js";
import Database from "../internal/Database";
import { Directories } from "../enums/Directories";

export default class RandomEmote implements ICommand {
    cmdName: string = "Random";
    usage: string = "[name]";
    description: string = "Sends a random emote.";
    aliases: string[] = ["randomemote"];
    args: boolean = false;
    needsArgs: boolean = false;
    adminOnly: boolean = false;
    WIP: boolean = false;

    async run(message: Message, args: string[]) {
        let randomEmote = await Database.getRandom();
        let emoteName = randomEmote[0].name.split('.')[0];
        await message.channel.send(`**${emoteName}**`, {
            files: [{
                attachment: Directories.EmoteDir + randomEmote[0].name,
                name: randomEmote[0].name
            }]
        });
    }

}