import { TextAdventureDao } from "../types/TextAdventureDao.type";

export class TextAdventure {
    private _title: string;
    

    constructor(textadventureDao: TextAdventureDao) {
        this._title = textadventureDao._title;
    }

    public get title(): string {
        return this._title;
    }
    public set title(value: string) {
        this._title = value;
    }
}