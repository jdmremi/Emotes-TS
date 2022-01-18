import { Message, MessageAttachment } from "discord.js";
import ICommand from "../../shared/interfaces/ICommand";
import ImageUtils, { IImageCanvas } from "../../shared/internal/ImageUtils";

export default class Canvas implements ICommand {
    public readonly cmdName: string = "Canvas";
    public readonly description: string = "Creates a 5x5 canvas containing random emotes!";
    public readonly aliases: string[] = ["c", "canvas"];
    public readonly usage: string = "[query]";
    public readonly args: boolean = true;
    public readonly needsArgs: boolean = false;
    public readonly WIP: boolean = false;
    public readonly adminOnly: boolean = false;

    public async run(message: Message, args: string[]) {
        let query: string = args[0];
        let canvas: IImageCanvas = query ?
            await ImageUtils.createCanvas(5, 5, query) :
            await ImageUtils.createCanvas(10, 10);

        let attachment = new MessageAttachment(canvas.canvas, "canvas.png");
        await message.channel.send({
            files: [attachment]
        });
    }
}