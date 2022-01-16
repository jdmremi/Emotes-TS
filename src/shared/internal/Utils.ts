import probe from 'probe-image-size';
import fs from 'fs';
import { IEmoteFileInfo } from '../interfaces/IEmoteFileInfo';
import { exec } from "child_process";

export default class Utils {
    public static sqlEscape(str: string): string {
        return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
            switch (char) {
                case "\0":
                    return "\\0";
                case "\x08":
                    return "\\b";
                case "\x09":
                    return "\\t";
                case "\x1a":
                    return "\\z";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "\"":
                case "'":
                case "\\":
                case "%":
                    return "\\" + char;
                default:
                    return char;
            }
        });
    }

    public static formatEmoteName(emoteName: string): string {
        if (emoteName.includes('@')) {
            return emoteName.split('@')[0].split('.')[0];
        }
        return emoteName.split('.')[0];
    }

    public static shuffleArray(array: any[]): any[] {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }


    public static getRandomHexColor(): string {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }

    public static async getFileInfo(path: string): Promise<IEmoteFileInfo | null | undefined> {
        let exists: boolean = fs.existsSync(path);
        if (exists) {
            const imageBuffer = fs.readFileSync(path);
            const imageInfo: probe.ProbeResult | null = probe.sync(imageBuffer);
            const fileSize: string = await this.humanizeFileSize(fs.statSync(path).size, true, 2);
            const fileInfo: IEmoteFileInfo = Object.assign(imageInfo, {
                fileSize: fileSize
            });

            return fileInfo;
        }
    }

    public static async humanizeFileSize(bytes: number, SIUnits: boolean, decimals: number): Promise<string> {
        const thresh: number = SIUnits ? 1000 : 1024;

        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }

        const units: string[] = SIUnits
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u: number = -1;
        const r: number = 10 ** decimals;

        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

        return bytes.toFixed(decimals) + ' ' + units[u];
    }

    public static async runCommandLine(command: string) {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(stdout);
                }
            });
        });
    }

}