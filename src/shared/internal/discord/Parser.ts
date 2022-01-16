import Emote from "../../models/Emote"
const emoteRegex: RegExp = /<(a)?:([a-zA-Z0-9_]{2,32}):(\d{1,20})>/g;

export default async function parseEmotes(str: string): Promise<Emote[]> {
    let emotes: Array<Emote> = [];
    let match;

    while((match = emoteRegex.exec(str)) !== null) {
        let extension: string = match[1] === 'a' && match[1] !== null ? '.gif' : '.png';
        let name: string = match[2],
            id: string = match[3];

        if(!emotes.some((e) => e.id === id)) 
            emotes.push(new Emote(name, id, extension));
    }

    return emotes;

}