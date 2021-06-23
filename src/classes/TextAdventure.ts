import { Location } from "../types/Location.type";
import { TextAdventureDao } from "../types/TextAdventureDao.type";

export class TextAdventure {
    private _title: string;
    private _x: number;
    private _y: number;
    private _map: Location[];
    private _startX: number;    
    private _startY: number;
    private _textAdventureId: string;
    private _creatorUserId: string;
    private _playCounter: number;
    private _turnCounter: number;

    constructor(textadventureDao: TextAdventureDao) {
        this._title = textadventureDao._title;
        this._x = textadventureDao._x;
        this._y = textadventureDao._y;
        this._map = textadventureDao._map;
        this._startX = textadventureDao._startX;
        this._startY = textadventureDao._startY;
        this._textAdventureId = textadventureDao._textAdventureId;
        this._creatorUserId = textadventureDao._creatorUserId;
        this._playCounter = textadventureDao._playCounter;
        this._turnCounter = textadventureDao._turnCounter;
    }

    public get title(): string {
        return this._title;
    }
    public set title(value: string) {
        this._title = value;
    }

    public get x(): number {
        return this._x;
    }
    public set x(value: number) {
        this._x = value;
    }

    public get y(): number {
        return this._y;
    }
    public set y(value: number) {
        this._y = value;
    }

    public get map(): Location[] {
        return this._map;
    }
    public set map(value: Location[]) {
        this._map = value;
    }

    public get startX(): number {
        return this._startX;
    }
    public set startX(value: number) {
        this._startX = value;
    }

    public get startY(): number {
        return this._startY;
    }
    public set startY(value: number) {
        this._startY = value;
    }

    public get textAdventureId(): string {
        return this._textAdventureId;
    }
    public set textAdventureId(value: string) {
        this._textAdventureId = value;
    }

    public get creatorUserId(): string {
        return this._creatorUserId;
    }
    public set creatorUserId(value: string) {
        this._creatorUserId = value;
    }

    public get playCounter(): number {
        return this._playCounter;
    }
    public set playCounter(value: number) {
        this._playCounter = value;
    }

    public get turnCounter(): number {
        return this._turnCounter;
    }
    public set turnCounter(value: number) {
        this._turnCounter = value;
    }
}