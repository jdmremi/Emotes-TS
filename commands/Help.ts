import { Message } from "discord.js";
import ICommand from "../interfaces/ICommand";
import CommandMap from "../internal/CommandMap";

import "dotenv/config";

const prefix: string = <string>process.env.prefix;

export default class Help implements ICommand {
    cmdName: string = "Help";
    usage: string = "[command]";
    description: string = "List of all the commands or info about a specified command.";
    aliases: string[] = ["help"];
    args: boolean = false;
    needsArgs: boolean = false;
    adminOnly: boolean = false;
    WIP: boolean = false;

    async run(message: Message, args: string[], commands: CommandMap) {
        const data: any[] = [];
        if (!args.length) {
            data.push(`Commands: ${commands.getCommands().map((c) => c.cmdName.toLowerCase()).join(', ')}`);
            data.push(`\nYou can use \`${prefix}help [command]\` to learn more about a specific command.`);
        } else {
            let commandName = args[0]
            console.log(commands.has(commandName));
            if (!commands.has(commandName)) {
                await message.channel.send('That command does not exist.');
                return;
            }

            const command = commands.get(commandName);

            data.push(`**Name:** ${command?.cmdName}`);
            if (command?.description) data.push(`**Description:** ${command.description}`);
            if (command?.usage) data.push(`**Usage:** ${prefix}${command.cmdName} ${command.usage}`);


        }

        await message.channel.send(data);

    }

}