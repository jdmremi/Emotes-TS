import ICommand from "../interfaces/ICommand";
import { Client, Message } from "discord.js";

export default class Remove implements ICommand {
    cmdName: string = "Remove";
    usage: string = "[emote]";
    description: string = "Removes the given emoji";
    aliases: string[] = [];
    args: boolean = true;
    needsArgs: boolean = true;
    adminOnly: boolean = false;
    WIP: boolean = false;

    async run(message: Message, args: string[]) {
        if (args.length == 1) {
            let emoteName = args[0];
            var removed = this._deleteEmoteToServer(message, args[0]);
            return await message.reply("successfully removed :${removed}:.");
        } else {//requires more than one argument
            var total:number = 0;
            while(args.length != total) {
                let emoteName = args[total];
                var removed = this._deleteEmoteToServer(message, emoteName); 
                total++;
            }
            return await message.reply("successfully removed **${total}** emotes.")
        } //set needsArgs: boolean = true; in case the user does not send arguments
    }

    private _deleteEmoteToServer(message: Message, data: any): Promise<GuildEmoji> | undefined {
        var emoteID:string = Client.emojis.find(emoji => emoji.name === data);
        return message.guild.emojis.resolve(emoteID).delete();
    }

}
