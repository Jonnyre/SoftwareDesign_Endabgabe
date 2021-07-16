import { UserDao } from "../types/UserDao.type";
import { AbstractUser } from "./abstracts/AbstractUser";

export class User extends AbstractUser {
    constructor(_userDao: UserDao) {
        super();

        this.username = _userDao._username;
        this.password = _userDao._password;
        this.userId = _userDao._userId;
    }

}