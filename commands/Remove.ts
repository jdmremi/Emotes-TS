import { Message } from "discord.js";
import ICommand from "../interfaces/ICommand";

export default class Remove implements ICommand {
    cmdName: string = "Remove";
    usage: string = "[emote name]";
    description: string = "Removes the given emoji";
    aliases: string[] = [];
    args: boolean = true;
    needsArgs: boolean = true;
    adminOnly: boolean = false;
    WIP: boolean = false;

    async run(message: Message, args: string[]) {
        let target = args[0];
        let deleted = await this._deleteFromServer(message, target);

        await message.reply(`successfully deleted that emoji. (${deleted?.name})`);
    }

    private async _deleteFromServer(message: Message, emoteName: string) {
        return message.guild?.emojis.cache.find((emoji) => emoji.name === emoteName)?.delete();
    }

}
