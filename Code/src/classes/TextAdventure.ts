import { Location } from "../types/Location.type";
import { TextAdventureDao } from "../types/TextAdventureDao.type";
import ConsoleHandling from "./ConsoleHandling";

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

    constructor(_textadventureDao: TextAdventureDao) {
        this._title = _textadventureDao._title;
        this._x = _textadventureDao._x;
        this._y = _textadventureDao._y;
        this._map = _textadventureDao._map;
        this._startX = _textadventureDao._startX;
        this._startY = _textadventureDao._startY;
        this._textAdventureId = _textadventureDao._textAdventureId;
        this._creatorUserId = _textadventureDao._creatorUserId;
        this._playCounter = _textadventureDao._playCounter;
        this._turnCounter = _textadventureDao._turnCounter;
    }

    public get title(): string {
        return this._title;
    }
    public set title(_value: string) {
        this._title = _value;
    }

    public get x(): number {
        return this._x;
    }
    public set x(_value: number) {
        this._x = _value;
    }

    public get y(): number {
        return this._y;
    }
    public set y(_value: number) {
        this._y = _value;
    }

    public get map(): Location[] {
        return this._map;
    }
    public set map(_value: Location[]) {
        this._map = _value;
    }

    public get startX(): number {
        return this._startX;
    }
    public set startX(_value: number) {
        this._startX = _value;
    }

    public get startY(): number {
        return this._startY;
    }
    public set startY(_value: number) {
        this._startY = _value;
    }

    public get textAdventureId(): string {
        return this._textAdventureId;
    }
    public set textAdventureId(_value: string) {
        this._textAdventureId = _value;
    }

    public get creatorUserId(): string {
        return this._creatorUserId;
    }
    public set creatorUserId(_value: string) {
        this._creatorUserId = _value;
    }

    public get playCounter(): number {
        return this._playCounter;
    }
    public set playCounter(_value: number) {
        this._playCounter = _value;
    }

    public get turnCounter(): number {
        return this._turnCounter;
    }
    public set turnCounter(_value: number) {
        this._turnCounter = _value;
    }

    public async PlayTextAdventure(): Promise<void> {
        let posX: number = this.startX;
        let posY: number = this.startY;

        let isPlaying: boolean = true;
        while (isPlaying) {
            ConsoleHandling.PrintInput("");
            let currentLocation = this.map.find(location => location._x === posX && location._y === posY);
            ConsoleHandling.PrintInput("You are now in " + currentLocation?._title + "\n");
            let north = this.map.find(location => location._x === posX && location._y === posY - 1);
            let east = this.map.find(location => location._x === posX + 1 && location._y === posY);
            let south = this.map.find(location => location._x === posX && location._y === posY + 1);
            let west = this.map.find(location => location._x === posX - 1 && location._y === posY);

            this.PrintMap(north, east, south, west);
            
            let answer: string = await ConsoleHandling.Question("Where do you want to go next? [n/e/s/w] Or do you want to end? [end] ");

            switch (answer.toLowerCase()) {
                case "n":
                case "north":
                    if (north == undefined)
                        ConsoleHandling.PrintInput("You are not allowed to go in this direction");
                    else {
                        ConsoleHandling.PrintInput("You walked in north direction");
                        this.turnCounter++;
                        posY--;
                    }
                    break;
                case "e":
                case "east":
                    if (east == undefined)
                        ConsoleHandling.PrintInput("You are not allowed to go in this direction");
                    else {
                        ConsoleHandling.PrintInput("You walked in east direction");
                        this.turnCounter++;
                        posX++;
                    }
                    break;
                case "s":
                case "south":
                    if (south == undefined)
                        ConsoleHandling.PrintInput("You are not allowed to go in this direction");
                    else {
                        ConsoleHandling.PrintInput("You walked in south direction");
                        this.turnCounter++;
                        posY++;
                    }
                    break;
                case "w":
                case "west":
                    if (west == undefined)
                        ConsoleHandling.PrintInput("You are not allowed to go in this direction");
                    else {
                        ConsoleHandling.PrintInput("You walked in west direction");
                        this.turnCounter++;
                        posX--;
                    }
                    break;
                case "end":
                    isPlaying = false;
                    break;
                default:
                    ConsoleHandling.PrintInput("This is not a valid input.");
                    break;
            }
        }
    }

    private PrintMap(_north?: Location, _east?: Location, _south?: Location, _west?: Location): void {
        let countChars: number | undefined = 0
        countChars = _west?._title.length;
        if (countChars == undefined) {
            countChars = 0;
        }
        else
            countChars += 6;

        if (_north != undefined) {
            let northTextLen: number = _north._title.length;
            let titleOffset: number = countChars - Math.floor(northTextLen / 2);
            if (titleOffset < 0)
                titleOffset = 0;
            ConsoleHandling.PrintInput(Array(titleOffset).fill("\xa0").join("") + _north._title);
            ConsoleHandling.PrintInput(Array(countChars).fill("\xa0").join("") + "|");
            ConsoleHandling.PrintInput(Array(countChars).fill("\xa0").join("") + "N");
        }

        if (_west != undefined) {
            if (_east != undefined) {
                ConsoleHandling.PrintInput(_west._title + " ―― W   E ―― " + _east._title);
            }
            else
                ConsoleHandling.PrintInput(_west._title + " ―― W")
        }
        else if (_east != undefined) {
            ConsoleHandling.PrintInput("  E ―― " + _east._title)
        }

        if (_south != undefined) {

            ConsoleHandling.PrintInput(Array(countChars).fill("\xa0").join("") + "S");
            ConsoleHandling.PrintInput(Array(countChars).fill("\xa0").join("") + "|");
            let southTextLen: number = _south._title.length;
            let titleOffset: number = countChars - Math.floor(southTextLen / 2);
            if (titleOffset < 0)
                titleOffset = 0;
            ConsoleHandling.PrintInput(Array(titleOffset).fill("\xa0").join("") + _south._title);
        }

        ConsoleHandling.PrintInput("");
    }
}