import IDanbooruAPIResponse from "../../shared/interfaces/IDanbooruAPIResponse";
import cheerio from "cheerio";
import got from "got";

// s = safe, q = questionable, e = explicit
type DanbooruRating = 's' | 'q' | 'e';

export default class Request {

    /**
     * Gets a random image from danbooru.
     * @param {string} [tags] - The tags to search for.
     * @param {DanbooruRating} [rating] - The rating of the image.
     * @returns The JSON object containing the image data.
     */
    public static async getRandomDanbooruImage(tags?: string, rating?: DanbooruRating): Promise<IDanbooruAPIResponse> {
        let url: string = "https://danbooru.donmai.us/posts.json?random=true&limit=1";

        if (tags || tags !== '') 
            url += `&tags=${tags}`;

        if(rating || rating !== '')
            url += `&rating=${rating}`;

        let { body } = await got(url);
        return JSON.parse(body)[0] as IDanbooruAPIResponse;
    }

    /*public static async getLivechartLinks(): Promise<void> {
        let url: string = "https://www.livechart.me/fall-2021/tv";

        let { body } = await got(url);
        let $ = await cheerio.load(body);
    }*/

}