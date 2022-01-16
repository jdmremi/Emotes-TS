import fs from "fs";
import { Directories } from "../enums/Directories";
import Axios from "axios";

export default class Emote {
    name: string;
    id: string;
    url: string;
    extension: string;
    animated: boolean;

    // Pass in individual arguments or an actual emote? E.g <a?:name:id>
    constructor(name: string, id: string, extension: string) {
        this.name = name;
        this.id = id;
        this.extension = extension;
        this.url = `https://cdn.discordapp.com/emojis/${id}${extension}?v=1`;
        this.animated = extension === '.gif' ? true : false;
    }

    toString(): string {
        return `<${this.animated ? 'a' : ''}:${this.name}:${this.id}>`;
    }

    public async download(): Promise<this> {
        if (fs.existsSync(`${Directories.EmoteDir}${this.name}${this.extension}`)) {
            if (!fs.existsSync(`${Directories.DupeDir}${this.name}@${this.id}${this.extension}`)) {
                let downloadedDupe: any = await this._download(`${Directories.DupeDir}${this.name}@${this.id}${this.extension}`);
                Object.assign(downloadedDupe, {
                    duplicate: true
                });

                return downloadedDupe;

            }

            return Object.assign(this, {
                duplicate: true
            });

        } else {
            let downloadedEmote: any = await this._download(`${Directories.EmoteDir}${this.name}${this.extension}`);
            Object.assign(downloadedEmote, {
                duplicate: false
            });
            return downloadedEmote;
        }

    }

    private async _download(path: string): Promise<void> {
        const writer = fs.createWriteStream(path);
        /*return Axios({
            method: 'GET',
            url: this.url,
            responseType: 'stream',
        }).then((response) => {
            return new Promise((res, rej) => {
                response.data.pipe(writer);
                let error: any = null;

                writer.on('error', (e) => {
                    error = e;
                    writer.close();
                    rej();
                });

                writer.on('close', () => {
                    if (!error) {
                        res(this);
                    }
                });

            });
        });*/

        let request = await Axios({
            method: 'GET',
            url: this.url,
            responseType: 'stream',
        });

        request.data.pipe(writer);
        let error: Error = {} as Error;

        writer.on('error', (e) => {
            error = e;
            writer.close();
            return null;
        });

        writer.on('close', () => {
            if (!error) {
                return this;
            }
        });

    }

}