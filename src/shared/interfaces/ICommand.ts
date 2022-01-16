import { Message } from "discord.js";

export default interface ICommand {
    cmdName: string;
    usage: string;
    description: string;
    aliases: string[];
    args: boolean;
    needsArgs: boolean;
    WIP: boolean;
    adminOnly: boolean;
    run(...args: any[]): Promise<Message> | any;
}