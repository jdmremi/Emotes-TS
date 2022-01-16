import parseEmotes from "./discord/Parser";
import Emote from "../models/Emote";

export default class Parsers {

    public static parseEmotes(str: string): Promise<Emote[]> {
        return parseEmotes(str);
    }

    public static async parseLiveChartEpisodes(): Promise<any> {
        return 0;
    }

}