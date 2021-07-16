
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
  
    public set username(_value: string) {
      this._username = _value;
    }
  
    public get password(): string {
      return this._password;
    }
    public set password(_value: string) {
      this._password = _value;
    }
  
    public get userId(): string {
      return this._userId;
    }
  
    public set userId(_value: string) {
      this._userId = _value;
    }
}