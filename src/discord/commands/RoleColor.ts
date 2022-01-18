import { ColorResolvable, Message } from "discord.js";
import { Regexes } from "../../shared/enums/Regexes";
import ICommand from "../../shared/interfaces/ICommand";
import Utils from "../../shared/internal/Utils";

export default class RoleColor implements ICommand {
    public readonly cmdName: string = "RoleColor";
    public readonly description: string = "Assigns a color role";
    public readonly usage: string = "[hex color code] | [rgb values (r,g,b)] | random";
    public readonly aliases: string[] = ["role"];
    public readonly args: boolean = true;
    public readonly needsArgs: boolean = true;
    public readonly WIP: boolean = false;
    public readonly adminOnly: boolean = false;

    private _vipRoleId: string = "426122292578353167";

    private _colorRegexes: [Regexes, RegExp][] = [
        [Regexes.HexColor, /^#?(?:[0-9a-fA-F]{3}){1,2}$/],
        [Regexes.RGBColor, /^(\d{1,3}),(\d{1,3}),(\d{1,3})$/]
    ];

    public async run(message: Message, args: string[]) {
        if (args.join(' ').match(/random/ig)) {
            let randomColor: string = Utils.getRandomHexColor(),
                createdRole = await this._createRole(message, randomColor);

            await this._assignRole(message, createdRole);
            await message.reply(`successfully created and assigned you the role: \`${createdRole?.name}\` with random color \`${createdRole?.hexColor.toUpperCase()}\`!`);

        } else {
            // Because of how Array#every works, this might not be working correctly.
            // Array#forEach might be what we need here.
            this._colorRegexes.every((regex) => {
                let type: Regexes = regex[0],
                    exp: RegExp = regex[1];

                let msg = args.join(' '),
                    match = exp.exec(msg);

                (async () => {
                    if (match) {
                        switch (type) {
                            case Regexes.HexColor:
                                let color: string = match[0],
                                    createdRole = await this._createRole(message, color);

                                await this._assignRole(message, createdRole);
                                await message.reply(`successfully created and assigned you the role: \`${createdRole?.name}\` with color \`${createdRole?.hexColor.toUpperCase()}\`!`);

                                break;
                            case Regexes.RGBColor:
                                let rgbArray: ColorResolvable = [
                                    parseInt(match[1]),
                                    parseInt(match[2]),
                                    parseInt(match[3])
                                ];

                                createdRole = await this._createRole(message, rgbArray);

                                await this._assignRole(message, createdRole);
                                await message.reply(`successfully created and assigned you the role: \`${createdRole?.name}\` with color \`${createdRole?.hexColor.toUpperCase()}\`!`);

                                break;
                        }
                    } else {
                        await message.reply('that doesn\'t look like a valid color :(');
                    }
                })();

            });
        }

    }

    private async _assignRole(message: Message, role: any) {
        return await message.member?.roles.add(role);
    }

    private async _createRole(message: Message, color: ColorResolvable | any) {

        let name = `${message.author.username} <3`;
        let roleExists: boolean = message.guild?.roles.cache.find((role) => role.name === name) !== undefined ? false : true;

        if (roleExists) {
            let created = await message.guild?.roles.create({
                name: name,
                color: color,
                position: message.guild.roles.cache.get(this._vipRoleId) ? <number>message.guild.roles.cache.get(this._vipRoleId)?.position + 1 : 1
            });

            return created;

        } else {

            let existingRoleId = message.guild?.roles.cache.find((role) => role.name === name)?.id;
            let created = await message.guild?.roles.cache.get(<string>existingRoleId)?.setColor(color);

            return created;

        }

    }

}