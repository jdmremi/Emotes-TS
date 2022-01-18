import { Message, MessageAttachment } from "discord.js";
import Database from "../../shared/internal/Database";
import IDatabaseEmote from "../../shared/interfaces/IDatabaseEmote";
import ICommand from "../../shared/interfaces/ICommand";
import { Directories } from "../../shared/enums/Directories";

export default class Spam implements ICommand {
    public readonly cmdName: string = "Spam";
    public readonly description: string = "Sends all emotes of a given query in a channel.";
    public readonly aliases: string[] = ["spam", "spamemotes"];
    public readonly usage: string = "[query]";
    public readonly args: boolean = true;
    public readonly needsArgs: boolean = true;
    public readonly WIP: boolean = false;
    public readonly adminOnly: boolean = true;
    public async run(message: Message, args: string[]) {
        let query: string = args[0];
        let emotes: IDatabaseEmote[] = await Database.searchEmotes(query);
        for (const emote of emotes) {
            await message.channel.send({
                content: `**${emote.name.split('.')[0]}**`,
                files: [`${Directories.EmoteDir}${emote.name}`]
            });
        }
    }
}