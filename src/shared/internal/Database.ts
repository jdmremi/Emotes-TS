import sqlite3 from 'sqlite3';
import Utils from './Utils';

import "dotenv/config";
import IDatabaseEmote from '../interfaces/IDatabaseEmote';
import { config } from "dotenv";
import { Directories } from "../../shared/enums/Directories";
import { Snowflake } from 'discord.js';
import IDatabaseEmoteRating from '../interfaces/IDatabaseEmoteRating';
import IRatingSimple from '../interfaces/IRatingSimple';

config({
    path: Directories.Home + ".env"
});

let dbPath = <string>process.env.dbPath;
let sqlImport = sqlite3.verbose();
let db = new sqlImport.Database(dbPath);

type rating = "like" | "dislike";
type RatingUpdatedResult = "Like successfully removed" | "Dislike successfully removed" | "Liked successfully" | "Disliked successfully";

export default class Database {
    public static searchDupes(query: string): Promise<any[]> {
        let result: any = [];
        let q: string = Utils.sqlEscape(query);
        return new Promise((res, rej) => {
            db.all(`SELECT element, name FROM newdupes WHERE name LIKE ?`, [`%${q}%`], (err, row) => {
                if (err) rej(err);
                result = result.concat(row);
                res(result);
            });
        });
    }

    public static async searchEmotes(query: string): Promise<IDatabaseEmote[]> {
        let result: any = [];
        let q: string = Utils.sqlEscape(query);
        return new Promise((res, rej) => {
            db.all(`SELECT element, name FROM newemotes WHERE name LIKE ?`, [`%${q}%`], (err, row) => {
                if (err) rej(err);
                result = result.concat(row);
                res(result);
            });
        });
    }

    public static async getRandom(): Promise<IDatabaseEmote[]> {
        return new Promise((res, rej) => {
            db.all(`SELECT * FROM ( SELECT name, element FROM newemotes UNION ALL SELECT name, element FROM newdupes) ORDER BY RANDOM() LIMIT 1`, (err, row) => {
                if (err) rej(err);
                res(row);
            });
        });
    }

    public static async getRandomWithQuery(query: string): Promise<IDatabaseEmote[]> {
        query = Utils.sqlEscape(query);
        return new Promise((res, rej) => {
            db.all(`SELECT * FROM (SELECT name, element FROM newemotes UNION ALL SELECT name, element FROM newdupes) WHERE name LIKE ? ORDER BY RANDOM() LIMIT 1`, [`%${query}%`], (err, row) => {
                if (err) rej(err);
                res(row);
            });
        });
    };

    public static async getEmoteById(id: string): Promise<IDatabaseEmote[]> {
        id = Utils.sqlEscape(id);
        return new Promise((res, rej) => {
            db.all(`SELECT name, element FROM newemotes WHERE element = ?`, [id], (err, row) => {
                if (err) rej(err);
                res(row);
            });
        });
    }

    public static async getDuplicateById(id: string): Promise<IDatabaseEmote[]> {
        id = Utils.sqlEscape(id);
        return new Promise((res, rej) => {
            db.all(`SELECT name, element FROM newdupes WHERE element = ?`, [id], (err, row) => {
                if (err) rej(err);
                res(row);
            });
        })
    }

    public static async searchAll(query: string): Promise<IDatabaseEmote[]> {
        query = Utils.sqlEscape(query);
        return new Promise((res, rej) => {
            db.all(`SELECT * FROM ( SELECT name, element FROM newemotes UNION ALL SELECT name, element FROM newdupes ) WHERE name LIKE ?`, [`%${query}%`], (err, row) => {
                if (err) rej(err);
                res(row);
            });
        });
    }

    public static async getAll(): Promise<IDatabaseEmote[]> {
        return new Promise((res, rej) => {
            db.all(`SELECT * FROM ( SELECT name, element FROM newemotes UNION ALL SELECT name, element FROM newdupes )`, (err, row) => {
                if (err) rej(err);
                res(row);
            });
        });
    }

    public static async insertHash(table: string, element: string, hash: string): Promise<void> {
        element = Utils.sqlEscape(element);
        hash = Utils.sqlEscape(hash);
        return new Promise((res, rej) => {
            db.run(`INSERT INTO ${table} (element, hash) VALUES (?, ?)`, [element, hash], (err) => {
                if (err) rej(err);
                res();
            });
        });
    }

    public static async insertRating(element: string, userId: Snowflake | string, rating: rating): Promise<RatingUpdatedResult> {
        element = Utils.sqlEscape(element);
        userId = Utils.sqlEscape(userId);

        let userRatings = (await this.getRatingsByUserId(userId))
            .filter((emote: IDatabaseEmoteRating) => emote.element === element);

        let databaseUserRating: IDatabaseEmoteRating[] = await this.getUserRatingsForEmote(userId, element);

        return new Promise((res, rej) => {
            if (userRatings.length >= 1) {
                if (rating === "like") {
                    let statement: string = databaseUserRating[0].liked === 1 ?
                        "UPDATE ratings SET liked = 0 WHERE element = ? AND userId = ?" :
                        "UPDATE ratings SET liked = 1, disliked = 0 WHERE element = ? AND userId = ?"

                    let result: RatingUpdatedResult = databaseUserRating[0].liked === 1 ?
                        "Like successfully removed" :
                        "Dislike successfully removed";

                    db.run(statement, [element, userId], (err) => {
                        if (err) rej(err);
                        res(result);
                    });
                } else {
                    let statement: string = databaseUserRating[0].disliked === 1 ?
                        "UPDATE ratings SET disliked = 0 WHERE element = ? AND userId = ?" :
                        "UPDATE ratings SET liked = 0, disliked = 1 WHERE element = ? AND userId = ?"

                    let result: RatingUpdatedResult = databaseUserRating[0].disliked === 1 ?
                        "Disliked successfully" :
                        "Liked successfully";

                    db.run(statement, [element, userId], (err) => {
                        if (err) rej(err);
                        res(result);
                    });
                }
            } else {
                let params: any[] = rating === "like" ?
                    [element, userId, 1, 0] :
                    [element, userId, 0, 1];

                let result: RatingUpdatedResult = params[2] === 1 ?
                    "Liked successfully" :
                    "Disliked successfully";

                db.run(`INSERT INTO ratings (element, userId, liked, disliked) VALUES (?, ?, ?, ?)`, params, (err) => {
                    if (err) rej(err);
                    res(result);
                });
            }
        });
    }

    public static async getRatingsByUserId(userId: string): Promise<IDatabaseEmoteRating[]> {
        userId = Utils.sqlEscape(userId);
        return new Promise((res, rej) => {
            db.all(`SELECT * FROM ratings WHERE userId = ?`, [userId], (err, row) => {
                if (err) rej(err);
                res(row);
            });
        });
    }

    public static async getRatingsByEmoteId(element: string): Promise<IRatingSimple> {
        return new Promise((res, rej) => {
            db.all(`SELECT * FROM ratings WHERE element = ?`, [element], (err, row) => {
                if (err) rej(err);
                let numLikes = 0;
                let numDislikes = 0;
                for (const result of row) {
                    numLikes += result.liked;
                    numDislikes += result.disliked;
                }
                res({
                    numLikes,
                    numDislikes
                });
            });
        });
    }

    public static async getUserRatingsForEmote(userId: string, element: string): Promise<IDatabaseEmoteRating[]> {
        userId = Utils.sqlEscape(userId);
        return (await this.getRatingsByUserId(userId))
            .filter((emote: IDatabaseEmoteRating) => emote.element === element);
    }

}