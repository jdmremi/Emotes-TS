import { Message } from "discord.js";
import parseEmotes from "../internal/Parser";
import Emote from "../models/Emote";
import "dotenv/config"

const prefix: string = <string>process.env.prefix;

export default async function RunMessage(message: Message, commands: Map<any, any>): Promise<void> {

    let messageEmotes: Emote[] = await parseEmotes(message.content);

    messageEmotes.forEach(async(e: Emote) => {
        let downloaded = await e.download();
        console.log(downloaded);
    });

    if(!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/\s+/),
    commandName = args.shift()?.toLowerCase();

    if(!commands.has(commandName) || !commands.get(commandName).command.aliases.includes(commandName)) return;
    
    const cmd = commands.get(commandName);

    if(cmd.args && !args.length && cmd.needsArgs) {
        let reply = `Command needs args to run, ${message.author.username} :(\n`;
        if(cmd.usage) {
            reply += `\nUsage: ${prefix}${cmd.cmdName} 
            ${cmd.aliases.length >= 1 ? (`aliases: ` + cmd.aliases.join(' ')) : ''}
            ${cmd.usage}`;
        }

        await message.channel.send(reply);
        return;

    }

    try {
        await cmd.command.run(message);
    } catch(e) {
        console.error(e);
        await message.reply('there was an error trying to execute that command.');
    }
}