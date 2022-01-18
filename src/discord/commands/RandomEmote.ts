import ICommand from "../../shared/interfaces/ICommand";
import { Message, MessageAttachment, MessageEmbed } from "discord.js";
import Database from "../../shared/internal/Database";
import { Directories } from "../../shared/enums/Directories";
import Utils from "../../shared/internal/Utils";
import { IEmoteFileInfo } from "../../shared/interfaces/IEmoteFileInfo";
import ComponentFactory from "../../shared/internal/discord/ComponentFactory";
import ImageUtils from "../../shared/internal/ImageUtils";

export default class RandomEmote implements ICommand {
    public readonly cmdName: string = "RandomEmote";
    public readonly usage: string = "[name]";
    public readonly description: string = "Sends a random emote.";
    public readonly aliases: string[] = ["randomemote", "random"];
    public readonly args: boolean = false;
    public readonly needsArgs: boolean = false;
    public readonly adminOnly: boolean = false;
    public readonly WIP: boolean = false;

    public async run(message: Message, args: string[]) {
        let randomEmote; // [{ element: 0, name: something@23434.png }]
        let emoteName; // something
        let directoryName; // ../duplicates/
        let embedAttachmentName; // something@23434.png
        let emoteId; // 0

        if (args.length >= 1) {
            randomEmote = await Database.getRandomWithQuery(args[0]);
            directoryName = randomEmote[0].name.includes('@') ? Directories.DupeDir : Directories.EmoteDir;
            emoteName = randomEmote[0].name.includes('@') ? randomEmote[0].name.split('@')[0] : randomEmote[0].name.split('.')[0];
            embedAttachmentName = randomEmote[0].name;
            emoteId = randomEmote[0].name.includes('@') ? `@${randomEmote[0].element}` : randomEmote[0].element;
        } else {
            randomEmote = await Database.getRandom();
            directoryName = randomEmote[0].name.includes('@') ? Directories.DupeDir : Directories.EmoteDir;
            emoteName = randomEmote[0].name.includes('@') ? randomEmote[0].name.split('@')[0] : randomEmote[0].name.split('.')[0];
            embedAttachmentName = randomEmote[0].name;
            emoteId = randomEmote[0].name.includes('@') ? `@${randomEmote[0].element}` : randomEmote[0].element;
        }

        const imagePath: any = directoryName + randomEmote[0].name;
        const stats: IEmoteFileInfo | undefined | null = await Utils.getFileInfo(imagePath);
        const embed: MessageEmbed = new MessageEmbed();
        const embedImage: MessageAttachment = new MessageAttachment(imagePath, embedAttachmentName.replace('@', ''));
        const embedColor: any = await ImageUtils.getAverageColor(imagePath);

        if (stats) {
            embed
                .setTitle(emoteName)
                .setImage(`attachment://${embedAttachmentName.replace('@', '')}`)
                .addField('Dimensions', `${stats.width}x${stats.height}`, true)
                .addField('Size', stats.fileSize, true)
                .addField('Type', stats.mime, true)
                .setFooter(`ID: ${emoteId}`)
                .setColor(embedColor.hex)

            await message.channel.send({
                files: [embedImage],
                embeds: [embed],
                components: [ComponentFactory.createEmoteMessageComponents()]
            });
        }
    }

}