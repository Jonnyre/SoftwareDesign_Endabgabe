import { UserDao } from "../types/UserDao.type";
import { AbstractUser } from "./abstracts/AbstractUser";

export class User extends AbstractUser {
    constructor(userDao: UserDao) {
        super();

        this.username = userDao._username;
        this.password = userDao._password;
        this.userId = userDao._userId;
    }

}

export enum UserState {
    NOTLOGGEDIN = 0,  
    LOGGEDIN = 1
}