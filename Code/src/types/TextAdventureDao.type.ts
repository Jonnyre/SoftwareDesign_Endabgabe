import { Location } from "./Location.type";
export type TextAdventureDao = {
    _title: string,
    _x: number,
    _y: number,
    _map: Location[],
    _startX: number,
    _startY: number,
    _textAdventureId: string,
    _creatorUserId: string,
    _playCounter: number,
    _turnCounter: number,
};