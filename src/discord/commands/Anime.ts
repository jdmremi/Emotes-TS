import { Message } from "discord.js";
import ICommand from "../../shared/interfaces/ICommand";

export default class Anime implements ICommand {
    public readonly cmdName: string = "Anime";
    public readonly description: string = "Gets info about an anime.";
    public readonly aliases: string[] = ["anime", "animeinfo"];
    public readonly usage: string = "[name]";
    public readonly args: boolean = true;
    public readonly needsArgs: boolean = true;
    public readonly WIP: boolean = true;
    public readonly adminOnly: boolean = false;

    public async run(message: Message, args: string[]) {

    }

}