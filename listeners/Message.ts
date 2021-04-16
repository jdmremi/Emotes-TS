import { Message } from "discord.js";
import parseEmotes from "../internal/Parser";
import Emote from "../models/Emote";
import CommandMap from "../internal/CommandMap";
import ICommand from "../interfaces/ICommand";

import "dotenv/config"

const prefix: string = <string>process.env.prefix;

export default async function RunMessage(message: Message, commands: CommandMap): Promise<void> {

    /*let messageEmotes: Emote[] = await parseEmotes(message.content);

    messageEmotes.forEach(async (e: Emote) => {
        let downloaded = await e.download();
        console.log(downloaded);
    });*/

    if (message.content.startsWith(prefix)) {
        console.log('Starts with prefix!');
        const args: string[] = message.content.slice(prefix.length).split(/\s+/),
            commandName = args.shift()?.toLowerCase();

        if (!commandName) return;
        if (!commands.has(commandName)) return;

        const cmd = commands.get(commandName);

        if (!cmd) return;

        if (cmd.args && !args.length && cmd.needsArgs) {
            let reply = `Command needs args to run, ${message.author.username} :(\n`;
            if (cmd.usage) {
                reply += `\nUsage: ${prefix}${cmd.cmdName} ${cmd.aliases.length >= 1 ? (`aliases: ` + cmd.aliases.join(' ')) : ''} ${cmd.usage}`;
            }

            await message.channel.send(reply);

        }

        try {
            await cmd.run(message, args, commands);
        } catch (e) {
            console.error(e);
            await message.reply('there was an error trying to execute that command.');
        }
    }
}