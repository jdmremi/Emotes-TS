export default class Emote {
    name: string;
    id: string;
    url: string;
    type: string;
    animated: boolean;

    // Pass in individual arguments or an actual emote? E.g <a?:name:id>

    constructor(name: string, id: string, type: string) {
        this.name = name;
        this.id = id;
        this.type = type;
        this.url = `https://cdn.discordapp.com/emojis/${id}${type}?v=1`;
        this.animated = type === '.gif' ? true : false;
    }

    toString(): string {
        return `<${this.animated ? 'a' : ''}:${this.name}:${this.id}>`;
    }

}