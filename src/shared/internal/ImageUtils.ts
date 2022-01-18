import IDatabaseEmote from "../interfaces/IDatabaseEmote";
import Database from "./Database";
import { Directories } from "../enums/Directories";
import fs from "fs";
import sharp, { OverlayOptions, Sharp } from "sharp";
import { getAverageColor } from 'fast-average-color-node';
import { IFastAverageColorResult } from 'fast-average-color';
import Utils from "./Utils";

export interface IImageCanvas {
    canvas: Buffer;
    info: IDatabaseEmote[];
}

export default class ImageUtils {
    public static async createCanvas(width: number, height: number, query?: string): Promise<IImageCanvas> {
        let numEmotes: number = width * height;
        let images: IDatabaseEmote[] = [];
        let bufferedImages: Buffer[] = [];

        // #URGENT
        // kieve: How do you plan on approaching situations where like 1 gif loops in 7 seconds,
        // another loops in 11, and the only way to get them all to loop consistently is for it to be like 77 seconds long?
        // ----------------------------------------------------------------------------------------------------------------
        // can be possibly removed, unless we can find a different way to handle this: 
        if (numEmotes < 25)
            throw new Error("Unable to create image canvas: not enough emotes found.");

        if (query) {
            images = (await Database.searchAll(query)).slice(0, numEmotes);
        } else {
            while (images.length <= numEmotes)
                images.push((await Database.getRandom())[0]);
        }

        images = Utils.shuffleArray(images);
        await Promise.all(images.map(async (image) => {
            let dir: Directories = image.name.includes("@") ? Directories.DupeDir : Directories.EmoteDir;
            let fileBuffer: Buffer = fs.readFileSync(dir + image.name);
            let sharpBuffer: Buffer = await sharp(fileBuffer).resize(256, 256).toBuffer();
            bufferedImages.push(sharpBuffer);
        }));

        // with png it's slower, but there is no alpha channel. (transparent)
        // with jpeg it's VERY fast, but there IS a black background.
        let canvas: Sharp = await sharp({
            create: {
                width: width * 256,
                height: height * 256,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        }).png();

        let compositedImages: OverlayOptions[] = [];

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                let overlayOpts: OverlayOptions = {
                    top: i * 256,
                    left: j * 256,
                    input: bufferedImages[i * width + j]
                };
                compositedImages.push(overlayOpts);
            }
        }

        canvas.composite(compositedImages);
        let canvasBuffer = await canvas.toBuffer();

        return {
            canvas: canvasBuffer,
            info: images
        } as IImageCanvas;
    }

    public static async getFirstFrameFromGif(path: string): Promise<Buffer> {
        const fileName: string = new Date().getTime().toString() + ".png";
        const command: string = `ffmpeg -i ${path} -vframes 1 ${fileName}`;
        await Utils.runCommandLine(command);
        let result: Buffer = fs.readFileSync(fileName);
        fs.unlinkSync(fileName);
        return result;
    }

    /*
        Since this no longer works with gifs (at least on M1),
        we need to extract the first frame from the gif and use that as our
        buffer instead of the gif buffer itself.
    */
    /**
     * Get the average color of an image.
     * @param {string} file - string - The path to the image file.
     * @returns The average color of the image.
     */
    public static async getAverageColor(file: string): Promise<IFastAverageColorResult | undefined> {
        if (fs.existsSync(file)) {
            let buffer: Buffer = file.includes(".gif") ?
                await ImageUtils.getFirstFrameFromGif(file) :
                fs.readFileSync(file);

            return await getAverageColor(buffer);
        }
    }

    /**
     * Given a hex color, convert it to HSB.
     * @param {string} hex - string
     * @returns [0, 0, 0]
     */
    // https://stackoverflow.com/questions/56512436/how-to-sort-colors-of-a-particular-hue
    public static async hexToHSB(hex: string): Promise<number[] | undefined> {
        hex = hex.replace(/^#/, '');
        hex = hex.length === 3 ?
            hex.replace(/(.)/g, "$1$1")
            : hex;

        let red: number = parseInt(hex.substring(0, 2), 16) / 255,
            green = parseInt(hex.substring(2, 2), 16) / 255,
            blue = parseInt(hex.substring(4, 2), 16) / 255;
        let cMax: number = Math.max(red, green, blue),
            cMin = Math.min(red, green, blue),
            delta = cMax - cMin,
            saturation = cMax ? (delta / cMax) : 0;

        switch (cMax) {
            case 0:
                return [0, 0, 0];
            case cMin:
                return [0, 0, cMax];
            case red:
                return [60 * (((green - blue) / delta) % 6) || 0, saturation, cMax];
            case green:
                return [60 * (((blue - red) / delta) + 2) || 0, saturation, cMax];
            case blue:
                return [60 * (((red - green) / delta) + 4) || 0, saturation, cMax];
        }
    }

}