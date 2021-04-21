import { GuildEmoji, Message } from "discord.js";
import { Directories } from "../enums/Directories";
import { Regexes } from "../enums/Regexes";
import ICommand from "../interfaces/ICommand";
import Database from "../internal/Database";
import parseEmotes from "../internal/Parser"
import "dotenv/config"

const prefix: string = <string>process.env.prefix;

export default class Add implements ICommand {
    cmdName: string = "Add";
    usage: string = "[name url] | [emote] | [name attachment] | [name emote] | [emotes[]] | [id] | [name id]";
    description: string = "Adds an emote to the guild/server the command is invoked in."
    aliases: string[] = ["addemote"]
    adminOnly: boolean = false;
    needsArgs: boolean = true;
    args: boolean = true;
    WIP: boolean = false;

    private _regexes: [Regexes, RegExp][] = [
        [Regexes.IdOnly, /^(\d+)/],
        [Regexes.NameAndId, /^([a-zA-Z0-9_]+)\s(\d+)/],
        [Regexes.NameAndUrl, /([a-zA-Z0-9_]+)\s(https?:\/\/.*\.(?:png|gif))/i],
        [Regexes.NameAndEmote, /^([a-zA-Z0-9_]+)\s?<(a)?:([a-zA-Z0-9_]{2,32}):(\d{1,20})>/],
        [Regexes.EmoteOrMany, /<(a)?:([a-zA-Z0-9_]{2,32}):(\d{1,20})>/g]
    ];

    async run(message: Message, args: string[]) {
        if (message.attachments.size === 1) {
            let name: string = args[0];
            let targetUrl = message.attachments.first()?.url;
            var added = await this._addEmoteToServer(message, name, targetUrl);
            await message.reply(`successfully added ${added}`);

        } else {
            let addedEmotes: string[] = [];
            this._regexes.forEach((regex) => {
                let type: Regexes = regex[0],
                    exp: RegExp = regex[1];

                let msg = args.join(' '),
                    match = exp.exec(msg);

                if (match) {
                    (async () => {

                        let emoteName: any;
                        let databaseEmote: any;

                        let emoteId = '',
                            emoteUrl = '',
                            fileName = '';

                        switch (type) {
                            case Regexes.IdOnly:
                                emoteId = msg;
                                databaseEmote = await Database.getEmoteById(emoteId); // [{ name: 'emote.extension'}]
                                emoteName = databaseEmote[0].name.split('.')[0];
                                fileName = databaseEmote[0].name;

                                try {
                                    var added = await this._addEmoteToServer(message, emoteName, Directories.EmoteDir + fileName);
                                    await message.channel.send(`Successfully added ${added}`);
                                } catch (e) {
                                    await message.reply(`couldn't add that emoji :(\n\nIf you need help, try typing \`${prefix}help ${this.cmdName.toLowerCase()}\``);
                                }

                                break;
                            case Regexes.EmoteOrMany:
                                let emotes = await parseEmotes(msg);

                                await Promise.all(emotes.map(async (emote) => {
                                    var added = await this._addEmoteToServer(message, emote.name, emote.url);
                                    addedEmotes.push(added?.toString() as string);
                                }));

                                if (addedEmotes.length === 1) {
                                    await message.reply(`successfully added ${addedEmotes[0]}`)
                                } else if (addedEmotes.length > 1) {
                                    await message.reply(`successfully added **${emotes.length}** emotes: ${addedEmotes.join('')}`);
                                }

                                break;
                            case Regexes.NameAndId:
                                emoteName = match[1];
                                emoteId = match[2];
                                databaseEmote = await Database.getEmoteById(emoteId);
                                fileName = databaseEmote[0].name;
                                try {
                                    var added = await this._addEmoteToServer(message, emoteName, Directories.EmoteDir + fileName);
                                    await message.reply(`successfully added ${added}!`);
                                } catch (e) {
                                    await message.reply(`couldn't add that emoji :(\n\nIf you need help, try typing \`${prefix}help ${this.cmdName.toLowerCase()}\``);
                                }

                                break;
                            case Regexes.NameAndUrl:
                                emoteName = match[1];
                                emoteUrl = match[2];

                                try {
                                    var added = await this._addEmoteToServer(message, emoteName, emoteUrl);
                                    await message.reply(`successfully added ${added}!`);
                                } catch (e) {
                                    await message.reply(`couldn't add that emoji :(\n\nIf you need help, try typing \`${prefix}help ${this.cmdName.toLowerCase()}\``);
                                }

                                break;
                            case Regexes.NameAndEmote:
                                emoteName = match[1];
                                let parsed = await parseEmotes(match[0]);
                                try {
                                    var added = await this._addEmoteToServer(message, emoteUrl, parsed[0].url);
                                    await message.reply(`successfully added ${added}!`);
                                } catch (e) {
                                    return; // ??
                                }

                                break;
                        }
                    })();
                }

            });
        }

    }

    private _addEmoteToServer(message: Message, name: string, data: any): Promise<GuildEmoji> | undefined {
        return message.guild?.emojis.create(data, name);
    }

}