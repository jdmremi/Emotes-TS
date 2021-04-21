import { Message } from "discord.js";
import ICommand from "../interfaces/ICommand";
import Database from "../internal/Database";

import "dotenv/config"

const prefix: string = <string>process.env.prefix;

export default class Search implements ICommand {
    cmdName: string = "Search";
    description: string = "Searches the database for emotes with a given query";
    usage: string = "[query]"
    needsArgs: boolean = true;
    args: boolean = true;
    aliases: string[] = [];
    WIP: boolean = true;
    adminOnly: boolean = false;

    // To-do: Embed pagination

    async run(message: Message, args: string[]) {
        let emotes = await Database.searchEmotes(args[0]);
        let messageToSendBody: string = '';

        if(emotes.length === 0) {
            return await message.reply('no emotes found with that query. :(');
        }

        for(var emote of emotes) {
            messageToSendBody += `[${emote.element}] - ${emote.name}\n`;
        }

        let messageToSendHeader = emotes.length === 0 ? `**1** emote found!` : `**${emotes.length}** emotes found!\n\n`
        let messagetoSendFooter = `You can type ${prefix}emote and then the emote's [id] to view it!`;
        await message.channel.send(`${messageToSendHeader}${messageToSendBody}\n${messagetoSendFooter}`, {
            split: true
        });

    }

}