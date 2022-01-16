import crypto, { Hash } from "crypto";
import fs, { ReadStream } from "fs";
import { Directories } from "../enums/Directories";
import IDatabaseEmote from "../interfaces/IDatabaseEmote";
import Database from "../internal/Database";

export function md5HashFile(path: string): Promise<string> {
    return new Promise((res, rej) => {
        try {
            let md5Sum: Hash = crypto.createHash("md5");
            let fileStream: ReadStream = fs.createReadStream(path);

            fileStream.on("data", (chunk: Buffer) => {
                md5Sum.update(chunk);
            });

            fileStream.on("end", () => {
                let hash: string = md5Sum.digest("hex");
                res(hash);
            });

        } catch (e) {
            rej(new Error(`Error hashing file: ${e}`));
        }
    });
}

// We might have to wrap this in a transaction due to the amount of data we're dealing with
export async function generateHashesForDatabaseContents() {
    const emotes: IDatabaseEmote[] = await Database.getAll();

    for (const emote of emotes) {
        let id: string = emote.element,
            name: string = emote.name,
            path: string = (emote.name.includes('@') ? Directories.DupeDir : Directories.EmoteDir) + name,
            table: string = emote.name.includes('@') ? "newdupes" : "emotes";
            
        let exists: boolean = fs.existsSync(path);
        if (exists) {
            let hash: string = await md5HashFile(path);
            await Database.insertHash(table, id, hash);
        }

    }
}