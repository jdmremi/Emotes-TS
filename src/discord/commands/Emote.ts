import { Message, MessageActionRow, MessageAttachment, MessageEmbed } from "discord.js";
import { Directories } from "../../shared/enums/Directories";
import { Regexes } from "../../shared/enums/Regexes";
import ICommand from "../../shared/interfaces/ICommand";
import { IEmoteFileInfo } from "../../shared/interfaces/IEmoteFileInfo";
import Database from "../../shared/internal/Database";
import parseEmotes from "../../shared/internal/discord/Parser";
import Utils from "../../shared/internal/Utils";
import ComponentFactory from "../../shared/internal/discord/ComponentFactory";
import ImageUtils from "../../shared/internal/ImageUtils";
import IDatabaseEmoteRating from "../../shared/interfaces/IDatabaseEmoteRating";
import IRatingSimple from "../../shared/interfaces/IRatingSimple";

export default class Emote implements ICommand {
    public readonly cmdName: string = "Emote";
    public readonly description: string = "Sends an emote along with related info.";
    public readonly aliases: string[] = ["emoteinfo", "image"];
    public readonly usage: string = "[emote] | [database id]";
    public readonly args: boolean = true;
    public readonly needsArgs: boolean = true;
    public readonly WIP: boolean = false;
    public readonly adminOnly: boolean = false;

    private _regexes: [Regexes, RegExp][] = [
        [Regexes.IdOnly, /^(\d+)/],
        [Regexes.EmoteOrMany, /<(a)?:([a-zA-Z0-9_]{2,32}):(\d{1,20})>/g],
        [Regexes.DuplicateIdOnly, /^\@(\d+)/]
    ];

    public async run(message: Message, args: string[]) {
        this._regexes.forEach((regex) => {
            let type: Regexes = regex[0],
                exp: RegExp = regex[1];

            let msg = args.join(' '),
                match = exp.exec(msg);

            if (match) {
                const embed: MessageEmbed = new MessageEmbed();
                (async () => {
                    switch (type) {
                        case Regexes.IdOnly:
                            let emote = await Database.getEmoteById(msg);
                            let emoteName: string = emote[0].name;
                            let emoteId: string = emote[0].element;
                            let imagePath: string = Directories.EmoteDir + emoteName;
                            let embedColor: any = await ImageUtils.getAverageColor(imagePath);
                            let stats: IEmoteFileInfo | null | undefined = await Utils.getFileInfo(imagePath);
                            let embedTitle: string = emote[0].name.split('.')[0];
                            let embedImage: MessageAttachment = new MessageAttachment(imagePath);
                            let ratings: IRatingSimple = await Database.getRatingsByEmoteId(emoteId);

                            if (stats) {
                                embed
                                    .setTitle(embedTitle)
                                    .setImage(`attachment://${emoteName.replace('@', '')}`)
                                    .addField('Dimensions', `${stats.width}x${stats.height}`, true)
                                    .addField('Size', stats.fileSize, true)
                                    .addField('Type', stats.mime, true)
                                    .setFooter(`ID: ${emoteId} | Likes: ${ratings.numLikes} | Dislikes: ${ratings.numDislikes}`)
                                    .setColor(embedColor.hex);

                                let components: MessageActionRow = ComponentFactory.createEmoteMessageComponents();

                                await message.channel.send({
                                    files: [embedImage],
                                    embeds: [embed],
                                    components: [components]
                                });
                            }

                            break;
                        case Regexes.EmoteOrMany:
                            let emotes = await parseEmotes(msg);
                            let first = emotes[0];

                            await message.channel.send({
                                content: `**${first.name}**`,
                                files: [first.url]
                            });

                            break;
                        case Regexes.DuplicateIdOnly:
                            let dupeId: string = msg.replace('@', '');
                            let duplicateEmote = await Database.getDuplicateById(dupeId);
                            let duplicateEmoteName: string = duplicateEmote[0].name;
                            let duplicateEmoteId: string = duplicateEmote[0].element;
                            let duplicateImagePath: string = Directories.DupeDir + duplicateEmoteName;
                            let duplicateEmbedColor: any = await ImageUtils.getAverageColor(duplicateImagePath);
                            let duplicateStats: any = await Utils.getFileInfo(duplicateImagePath);
                            let duplicateEmbedTitle: string = duplicateEmote[0].name.split('@')[0];
                            let duplicateEmbedImage: MessageAttachment = new MessageAttachment(duplicateImagePath, duplicateEmoteName.replace('@', ''));
                            let components: MessageActionRow = ComponentFactory.createEmoteMessageComponents();
                            let duplicateEmoteRatings: IRatingSimple = await Database.getRatingsByEmoteId('@' + duplicateEmoteId);

                            embed
                                .setTitle(duplicateEmbedTitle)
                                .addField('Dimensions', `${duplicateStats.width}x${duplicateStats.height}`, true)
                                .addField('Size', duplicateStats.fileSize, true)
                                .addField('Type', duplicateStats.mime, true)
                                .setImage(`attachment://${duplicateEmoteName.replace('@', '')}`)
                                .setFooter(`ID: @${duplicateEmoteId} | Likes: ${duplicateEmoteRatings.numLikes} | Dislikes: ${duplicateEmoteRatings.numDislikes}`)
                                .setColor(duplicateEmbedColor.hex);

                            await message.channel.send({
                                files: [duplicateEmbedImage],
                                embeds: [embed],
                                components: [components]
                            });
                    }
                })();
            }

        });
    }

}