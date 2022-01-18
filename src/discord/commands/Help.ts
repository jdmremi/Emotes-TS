import { Message } from "discord.js";
import ICommand from "../../shared/interfaces/ICommand";
import Commands from "../../shared/internal/discord/Commands";
import { config } from "dotenv";
import { Directories } from "../../shared/enums/Directories";

import "dotenv/config";

config({
    path: Directories.Home + ".env"
});

const prefix: string = <string>process.env.prCefix;

export default class Help implements ICommand {
    public readonly cmdName: string = "Help";
    public readonly usage: string = "[command]";
    public readonly description: string = "List of all the commands or info about a specified command.";
    public readonly aliases: string[] = [];
    public readonly args: boolean = false;
    public readonly needsArgs: boolean = false;
    public readonly adminOnly: boolean = false;
    public readonly WIP: boolean = false;

    public async run(message: Message, args: string[], commands: Commands) {
        const data: string[] = [];
        if (!args.length) {
            data.push(`Commands: ${commands.getCommands().map((c) => c.cmdName.toLowerCase()).join(', ')}`);
            data.push(`\nYou can use \`${prefix}help [command]\` to learn more about a specific command.`);
        } else {
            let commandName: string = args[0];
            if (!commands.has(commandName)) {
                await message.channel.send('That command does not exist.');
                return;
            }

            const command = commands.get(commandName);
            data.push(`**Name:** ${command?.cmdName}`);

            if (command?.description) data.push(`**Description:** ${command.description}`);
            if (command?.usage) data.push(`**Usage:** ${prefix}${command.cmdName.toLowerCase()} ${command.usage}`);

        }

        await message.channel.send(data.join('\n'));

    }

}