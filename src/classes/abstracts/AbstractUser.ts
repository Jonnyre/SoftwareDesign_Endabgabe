
export class AbstractUser {

    private _username: string;
    private _password: string;
    private _userId: string;
  
  
    constructor() {
  
      this._username = "";
      this._password = "";
      this._userId = "";
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
  
    public get userId(): string {
      return this._userId;
    }
  
    public set userId(value: string) {
      this._userId = value;
    }
}