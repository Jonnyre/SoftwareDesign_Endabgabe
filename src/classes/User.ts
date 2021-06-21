import { UserDao } from "../types/UserDao.type";

export class User {
    private _username: string;
    private _password: string;
    
    constructor(userDao: UserDao) {
        this._username = userDao._username;
        this._password = userDao._password;
    }

    public get username(): string {
        return this._username;
    }
    public set username(value: string) {
        this._username = value;
    }

    public get password(): string {
        return this._password;
    }
    public set password(value: string) {
        this._password = value;
    }
}