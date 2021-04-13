import axios, { AxiosPromise } from "axios"
import Emote from "../models/Emote"
import fs from "fs"

export default function downloadEmote(emote: Emote) {
    let response: AxiosPromise<any> = axios({
        url: emote.url,
        responseType: "stream"
    });

}