import { GuildEmoji, Message } from "discord.js";
import { Directories } from "../../shared/enums/Directories";
import { Regexes } from "../../shared/enums/Regexes";
import ICommand from "../../shared/interfaces/ICommand";
import Database from "../../shared/internal/Database";
import parseEmotes from "../../shared/internal/discord/Parser";
import Emote from "../../shared/models/Emote";
import IDatabaseEmote from "../../shared/interfaces/IDatabaseEmote";

import "dotenv/config";
import { config } from "dotenv";

config({
    path: Directories.Home + ".env"
});

const prefix: string = <string>process.env.prefix;

export default class Add implements ICommand {
    public readonly cmdName: string = "Add";
    public readonly usage: string = "[name url] | [emote] | [name attachment] | [name emote] | [emotes[]] | [id] | [name id]";
    public readonly description: string = "Adds an emote to the guild/server the command is invoked in."
    public readonly aliases: string[] = ["addemote"]
    public readonly adminOnly: boolean = false;
    public readonly needsArgs: boolean = false;
    public readonly args: boolean = false;
    public readonly WIP: boolean = false;

    private _regexes: [Regexes, RegExp][] = [
        [Regexes.IdOnly, /^@?(\d+)/],
        [Regexes.NameAndId, /^([a-zA-Z0-9_]+)\s(\d+)/],
        [Regexes.NameAndUrl, /([a-zA-Z0-9_]+)\s(https?:\/\/.*\.(?:png|gif))/i],
        [Regexes.NameAndEmote, /^([a-zA-Z0-9_]+)\s?<(a)?:([a-zA-Z0-9_]{2,32}):(\d{1,20})>/],
        [Regexes.EmoteOrMany, /<(a)?:([a-zA-Z0-9_]{2,32}):(\d{1,20})>/g]
    ];

    public async run(message: Message, args: string[]) {
        if (message.attachments.size === 1) {
            let name: string = args[0];
            let targetUrl: string | undefined = message.attachments.first()?.url;
            var added: GuildEmoji | undefined = await this._addEmoteToServer(message, name, targetUrl);
            await message.reply(`successfully added ${added}!`);
        } else {
            let addedEmotes: string[] = [];
            this._regexes.forEach((regex) => {
                let type: Regexes = regex[0],
                    exp: RegExp = regex[1];

                let msg: string = args.join(' '),
                    match = exp.exec(msg);

                if (match) {
                    (async () => {
                        let emoteName: string;
                        let databaseEmote: Array<IDatabaseEmote>;

                        let emoteId: string = '',
                            emoteUrl = '',
                            fileName = '';

                        switch (type) {
                            case Regexes.IdOnly:
                                if (msg.includes('@')) {
                                    emoteId = msg.replace('@', '');
                                    databaseEmote = await Database.getDuplicateById(emoteId);
                                    emoteName = databaseEmote[0].name.split('@')[0];
                                    fileName = databaseEmote[0].name;

                                    try {
                                        var added = await this._addEmoteToServer(message, emoteName, Directories.DupeDir + fileName);
                                        await message.channel.send(`Successfully added ${added}!`);
                                    } catch (e) {
                                        await message.reply(`couldn't add that emoji :(\n\nIf you need help, try typing \`${prefix}help ${this.cmdName.toLowerCase()}\``);
                                    }

                                } else {
                                    emoteId = msg;
                                    databaseEmote = await Database.getEmoteById(emoteId); // [{ name: 'emote.extension'}]
                                    emoteName = databaseEmote[0].name.split('.')[0];
                                    fileName = databaseEmote[0].name;

                                    try {
                                        var added = await this._addEmoteToServer(message, emoteName, Directories.EmoteDir + fileName);
                                        await message.channel.send(`Successfully added ${added}!`);
                                    } catch (e) {
                                        await message.reply(`couldn't add that emoji :(\n\nIf you need help, try typing \`${prefix}help ${this.cmdName.toLowerCase()}\``);
                                    }
                                }

                                break;
                            case Regexes.EmoteOrMany:
                                let emotes: Emote[] = await parseEmotes(msg);

                                await Promise.all(emotes.map(async (emote) => {
                                    var added = await this._addEmoteToServer(message, emote.name, emote.url);
                                    addedEmotes.push(added?.toString() as string);
                                }));

                                if (addedEmotes.length === 1) {
                                    await message.reply(`successfully added ${addedEmotes[0]}!`)
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
                                    var added: GuildEmoji | undefined = await this._addEmoteToServer(message, emoteName, emoteUrl);
                                    await message.reply(`successfully added ${added}!`);
                                } catch (e) {
                                    await message.reply(`couldn't add that emoji :(\n\nIf you need help, try typing \`${prefix}help ${this.cmdName.toLowerCase()}\``);
                                }

                                break;
                            case Regexes.NameAndEmote:
                                emoteName = match[1];
                                let parsed: Emote[] = await parseEmotes(match[0]);
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