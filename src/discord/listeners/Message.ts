import { Message } from "discord.js";
import Commands from "../../shared/internal/discord/Commands";

import "dotenv/config"

const prefix: string = <string>process.env.prefix;

export default async function RunMessage(message: Message, commands: Commands): Promise<void> {

    /*let messageEmotes: Emote[] = await parseEmotes(message.content);

    await Promise.all(messageEmotes.map(async(emote) => {
        let downloaded = await emote.download();
        console.log(downloaded.name);
    }));*/

    if (message.content.startsWith(prefix)) {
        const args: string[] = message.content.slice(prefix.length).split(/\s+/),
            commandName = args.shift()?.toLowerCase();

        if (!commandName) return;
        if (!commands.has(commandName)) return;

        const cmd = commands.get(commandName);

        if (!cmd) return;

        if (cmd.WIP) {
            await message.reply('that command is a work in progress.');
            return;
        }

        if (cmd.adminOnly && message.author.id !== '192956988764848128') {
            await message.reply('that command is set to admin only.');
            return;
        }

        if (cmd.args && !args.length && cmd.needsArgs) {
            let reply = `Command needs args to run, ${message.author.username}! :(\n`;
            if (cmd.usage) {
                reply += `\nUsage: \`${prefix}${cmd.cmdName.toLowerCase()} ${cmd.usage}\` ${cmd.aliases.length >= 1 ? (`\n\nAliases: \`${prefix}${cmd.aliases.join(' ')}\``) : ''}`;
            }

            await message.channel.send(reply);
            return;

        }

        try {
            await cmd.run(message, args, commands);
        } catch (e) {
            console.error(e);
            await message.reply(`there was an error trying to execute that command:\n\n\`${e}\``);
        }
    }
}