import sqlite3 from 'sqlite3';
import Utils from './Utils';

import "dotenv/config"

let dbPath = <string>process.env.dbPath;
let sqlImport = sqlite3.verbose();
let db = new sqlImport.Database(dbPath);

export default class Database {
    static searchDupes(query: string): Promise<any[]> {
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

    static searchEmotes(query: string): Promise<any[]> {
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

    static getRandom(): Promise<any> {
        return new Promise((res, rej) => {
            db.all(`SELECT element, name FROM newemotes ORDER BY RANDOM() LIMIT 1`, (err, row) => {
                if (err) rej(err);
                res(row);
            });
        });
    }

    static getEmoteById(id: string): Promise<any> {
        id = Utils.sqlEscape(id);
        return new Promise((res, rej) => {
            db.all(`SELECT name FROM newemotes WHERE element = ?`, [id], (err, row) => {
                if(err) rej(err);
                res(row);
            });
        });
    }

    static async searchAll(query: string) {
        let q: string = Utils.sqlEscape(query);
        let emotes = await this.searchEmotes(q);
        let dupes = await this.searchDupes(q);

        return emotes.concat(dupes);

    }

}