import { Message } from "discord.js";
import ICommand from "../../shared/interfaces/ICommand";
import Database from "../../shared/internal/Database";
import IDatabaseEmote from "../../shared/interfaces/IDatabaseEmote";
import fs from "fs";

import "dotenv/config";
import { config } from "dotenv";
import { Directories } from "../../shared/enums/Directories";

config({
    path: Directories.Home + ".env"
});

const prefix: string = <string>process.env.prefix;

export default class Search implements ICommand {
    public readonly cmdName: string = "Search";
    public readonly description: string = "Searches the database for emotes with a given query";
    public readonly usage: string = "[query]"
    public readonly needsArgs: boolean = true;
    public readonly args: boolean = true;
    public readonly aliases: string[] = [];
    public readonly WIP: boolean = false;
    public readonly adminOnly: boolean = false;

    // To-do: Embed pagination
    public async run(message: Message, args: string[]) {
        let query: string = args[0];
        let emotes: IDatabaseEmote[] = await Database.searchEmotes(query);
        let messageToSendBody: string = '';

        if (emotes.length === 0) {
            return await message.reply('no emotes found with that query. :(');
        }

        for (var emote of emotes) {
            messageToSendBody += `[${emote.element}] - ${emote.name}\n`;
        }

        let messageToSendHeader: string = emotes.length === 1 ? `**1** emote found!\n\n` : `**${emotes.length}** emotes found!\n\n`;
        let messagetoSendFooter: string = `You can type ${prefix}emote and then the emote's [id] to view it!`;

        if (messageToSendBody.length > 1900) {

            // Todo: Refactor
            // We can send a file buffer instead of unlinking the file after it's sent.
            let created = await this._writeFile(query, `${messageToSendHeader}${messagetoSendFooter}\n\n${messageToSendBody}`);
            /*await message.channel.send('', {
                files: [{
                    attachment: created,
                    name: created
                }]
            });*/

            await message.channel.send({
                files: [{
                    attachment: Buffer.from(`${messageToSendHeader}${messagetoSendFooter}\n\n${messageToSendBody}`),
                    name: `${query}.txt`
                }]
            });

            // fs.unlinkSync(created);
        } else {
            await message.channel.send(`${messageToSendHeader}${messageToSendBody}\n${messagetoSendFooter}`);
        }

    }

    private async _writeFile(query: string, data: any) {
        let file = `./temp/${query}_${new Date().getTime()}.txt`;
        fs.writeFileSync(file, data, {
            flag: 'wx'
        });
        return file;
    }

}
