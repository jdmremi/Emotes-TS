import { type } from "node:os";
import Emote from "../models/Emote"
const emoteRegex: RegExp = /<(a)?:([a-zA-Z0-9_]{2,32}):(\d{1,20})>/g;

// Should we just have this download all emotes as well? Or should we have a separate function?

export default async function parseEmotes(str: string): Promise<Emote[]> {
    let emotes: Array<Emote> = [];
    let match;

    while((match = emoteRegex.exec(str)) !== null) {

        let extension: string = match[1] === 'a' && match[1] !== null ? '.gif' : '.png';
        let name: string = match[2],
            id: string = match[3];

        let e: Emote = new Emote(name, id, extension);
        emotes.push(e);
        
    }

    return emotes;

}