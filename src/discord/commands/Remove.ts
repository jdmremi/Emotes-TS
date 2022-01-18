import { Message } from "discord.js";
import ICommand from "../../shared/interfaces/ICommand";

export default class Remove implements ICommand {
    public readonly cmdName: string = "Remove";
    public readonly usage: string = "[emote name]";
    public readonly description: string = "Removes a given emoji from the guild.";
    public readonly aliases: string[] = [];
    public readonly args: boolean = true;
    public readonly needsArgs: boolean = true;
    public readonly adminOnly: boolean = true;
    public readonly WIP: boolean = false;

    public async run(message: Message, args: string[]) {
        let target = args[0];
        let deleted = await this._deleteFromServer(message, target);

        await message.reply(`successfully deleted that emoji. (${deleted?.name})`);
    }

    private async _deleteFromServer(message: Message, emoteName: string) {
        return message.guild?.emojis.cache.find((emoji) => emoji.name === emoteName)?.delete();
    }

}