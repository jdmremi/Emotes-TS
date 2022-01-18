import { Message, MessageEmbed, Util } from "discord.js";
import ICommand from "../../shared/interfaces/ICommand";
import IDanbooruAPIResponse from "../../shared/interfaces/IDanbooruAPIResponse";
import Request from "../../shared/internal/Request";
import Utils from "../../shared/internal/Utils"

export default class Randbooru implements ICommand {
    public readonly cmdName: string = "Randbooru";
    public readonly usage: string = "<tags>"
    public readonly description: string = "Gets a random image from randbooru.";
    public readonly aliases: string[] = ['booru'];
    public readonly args: boolean = false;
    public readonly needsArgs: boolean = false;
    public readonly WIP: boolean = false;
    public readonly adminOnly: boolean = false;

    public async run(message: Message, args: string[]): Promise<any> {
        let tags: string = '';
        if (args)
            tags = encodeURIComponent(args.join(' '));
        let danbooruPost: IDanbooruAPIResponse = await Request.getRandomDanbooruImage(tags);

        if (!danbooruPost)
            return await message.reply('invalid tags provided. :(');

        let fileSize: string = await Utils.humanizeFileSize(danbooruPost.file_size, true, 2);

        const embed: MessageEmbed = new MessageEmbed()
            .setColor(0xFFB200)
            .setTitle(Util.escapeMarkdown(`${danbooruPost.tag_string_character} from ${danbooruPost.tag_string_copyright} by ${danbooruPost.tag_string_artist}`))
            .setImage(danbooruPost.file_url)
            .addField('Rating', danbooruPost.rating, true)
            .addField('Score', danbooruPost.score.toString(), true)
            .addField('Size', `${danbooruPost.image_width}x${danbooruPost.image_height} (${fileSize})`, true)

        await message.channel.send({ embeds: [embed] });

    }

}