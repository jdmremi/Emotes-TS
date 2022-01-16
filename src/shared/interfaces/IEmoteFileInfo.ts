type Orientation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface Variant {
    width: number;
    height: number;
}

export interface IEmoteFileInfo {
    fileSize: string;
    width: number;
    height: number;
    length: number;
    type: string;
    mime: string;
    wUnits: string;
    hUnits: string;
    url: string;
    orientation?: Orientation;
    variants?: Variant[];
}