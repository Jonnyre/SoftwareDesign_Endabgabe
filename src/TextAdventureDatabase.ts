// this objects are instances of a singleton pattern
import ConsoleHandling from "./classes/ConsoleHandling";
import FileHandler from "./classes/FileHandler";
import { TextAdventure } from "./classes/TextAdventure";
import { User, UserState } from "./classes/User";
import { Location } from "./types/Location.type";
import { TextAdventureDao } from "./types/TextAdventureDao.type";
import { UserDao } from "./types/UserDao.type";
import { v4 } from "uuid";
import { NullUser } from "./classes/NullUser";

export class TextAdventureDatabase {
  private _textAdventures: TextAdventure[] = [];
  private _users: User[] = [];
  private _currentUser: User = new NullUser();
  private _userState: UserState = UserState.NOTLOGGEDIN;

  private regNoSpecialCharacters: RegExp = new RegExp(/^[a-z0-9]+$/gi);

  constructor() {
    let textAdventureJson: TextAdventureDao[] = FileHandler.readArrayFile("../data/TextAdventure.json");
    let userJson: UserDao[] = FileHandler.readArrayFile("../data/User.json");

    for (let textAdventure of textAdventureJson) {
      this._textAdventures.push(new TextAdventure(textAdventure));
    }

    for (let user of userJson) {
      this._users.push(new User(user));
    }
  }

  public async ShowFunctionalities(): Promise<void> {
    let answer: string = await ConsoleHandling.showPossibilities(
      [
        "1. Search text adventure by title",
        "2. List all text adventures",
        "3. Sign in",
        "4. Register"
      ],
      "Which function do you want to use?: ");

    this.HandleAnswer(answer);
  }

  public async ShowRegisteredFunctionalities(): Promise<void> {
    let answer: string = await ConsoleHandling.showPossibilities(
      [
        "1. Search text adventure by title",
        "2. List all text adventures",
        "3. Create text adventure",
        "4. Show statistics"
      ],
      "Which function do you want to use?: ");

    this.HandleLoggedInAnswer(answer);
  }

  private async HandleLoggedInAnswer(answer: string): Promise<void> {
    switch (answer) {
      case "1":
        await this.SearchTextAdventureByTitle();
        break;
      case "2":
        await this.ListAllTextAdventures();
        break;
      case "3":
        await this.CreateTextAdventureMap();
        break;
        case "4":
          this.ShowStatistics();
      default:
        ConsoleHandling.printInput("Invalid answer. Try again.");
        break;
    }
    await this.GoNext();
  }

  public async HandleAnswer(answer: string) {
    switch (answer) {
      case "1":
        await this.SearchTextAdventureByTitle();
        break;
      case "2":
        await this.ListAllTextAdventures();
        break;
      case "3":
        await this.SignIn();
        break;
      case "4":
        await this.Register();
        break;
      default:
        break;
    }
    await this.GoNext();
  }

  public async SearchTextAdventureByTitle(): Promise<void> {
    let title: string = await ConsoleHandling.question("Which title are you looking for? ");
    let foundTextAdventure: TextAdventure | undefined = this._textAdventures.find(textadventure => textadventure.title === title);

    if (foundTextAdventure == undefined) {
      ConsoleHandling.printInput("There is no text adventure for your search: " + title);
      return;
    }

    let answer: string = await ConsoleHandling.question("Do you want to start text adventure: " + foundTextAdventure.title + "? [y/n]");

    switch (answer.toLowerCase()) {
      case "y":
      case "yes":
        await this.PlayTextAdventure(foundTextAdventure);
        break;
      case "n":
      case "no":
        this.GoNext();
        break;
      default:
        this.GoNext();
    }
  }

  public async ListAllTextAdventures(): Promise<void> {
    let count: number = 0;
    let possibilites: string[] = [];
    for (let i = count; i < count + 5; i++) {
      if (this._textAdventures[i] != undefined)
        possibilites.push(this._textAdventures[i].title + " [" + (i + 1) + "]");
    }
    let numberTextAdventure: number = Number(await ConsoleHandling.showPossibilities(possibilites, "Which text adventure do you want to start? [number] "));
    await this.PlayTextAdventure(this._textAdventures[numberTextAdventure - 1]);
  }

  public async SignIn(): Promise<void> {
    let username: string = await ConsoleHandling.question("What is your username? ");
    let password: string = await ConsoleHandling.question("What is your password? ");

    let userFound: User | undefined = this._users.find(user => {
      if (user.username === username && user.password === password)
        return user;
    });

    if (userFound == undefined) {
      ConsoleHandling.printInput("Login failed");
      return;
    }

    ConsoleHandling.printInput("Login successful");
    this._userState = UserState.LOGGEDIN;
    this._currentUser = userFound;
  }

  public async Register(): Promise<void> {
    let username: string = await ConsoleHandling.question("What is your username? ");
    let userFound: User | undefined = this._users.find(user => user.username === username);

    if (userFound) {
      ConsoleHandling.printInput("This username already exists, you will return now.");
      return;
    }

    if (!this.regNoSpecialCharacters.test(username)) {
      ConsoleHandling.printInput("Special characters are not allowed in username.");
      return;
    }

    let password: string = await ConsoleHandling.question("What is your password? ");
    let userId: string = v4();
    let newUserDao: UserDao = { _username: username, _password: password, _userId: userId };
    let newUser: User = new User(newUserDao);

    this._users.push(newUser);
    FileHandler.writeFile("../data/user.json", this._users);
    ConsoleHandling.printInput("Successful registration.");
  }

  public async CreateTextAdventureMap(): Promise<void> {
    let title: string = await ConsoleHandling.question("What is the title of the text adventure? ");
    let x: number = Number(await ConsoleHandling.question("What is the x value of the text adventure? "));
    let y: number = Number(await ConsoleHandling.question("What is the y value of the text adventure? "));

    let map: Location[] = [];
    for (let vertikal = 1; vertikal < y + 1; vertikal++) {
      for (let horizontal = 1; horizontal < x + 1; horizontal++) {
        let location: string = await ConsoleHandling.question("Which location do you want to add for (" + vertikal + "/" + horizontal + ") ");
        let newLocation: Location = { _y: vertikal, _x: horizontal, _title: location };
        map.push(newLocation)
      }
    }
    let startPosHor: string = await ConsoleHandling.question("Which is the start point horizontal? ");
    let startX: number = Number(startPosHor);

    let startPosVert: string = await ConsoleHandling.question("Which is the start point vertikal? ");
    let startY: number = Number(startPosVert);

    let textAdventureId: string = v4();
    let newTextAdventureDao: TextAdventureDao = { _title: title, _x: x, _y: y, _map: map, _startX: startX, _startY: startY, _textAdventureId: textAdventureId, _creatorUserId: this._currentUser.userId, _playCounter: 0, _turnCounter: 0 };
    let newTextAdventure: TextAdventure = new TextAdventure(newTextAdventureDao);

    this._textAdventures.push(newTextAdventure);
    FileHandler.writeFile("../data/TextAdventure.json", this._textAdventures);
    ConsoleHandling.printInput("Successful created text adventure.");
  }

  public async PlayTextAdventure(_textAdventure: TextAdventure): Promise<void> {
    let posX: number = _textAdventure.startX;
    let posY: number = _textAdventure.startY;

    let isPlaying: boolean = true;
    while (isPlaying) {
      ConsoleHandling.printInput("");
      let currentLocation = _textAdventure.map.find(location => location._x === posX && location._y === posY);
      ConsoleHandling.printInput("You are now in " + currentLocation?._title + "\n");
      let north = _textAdventure.map.find(location => location._x === posX && location._y === posY - 1);
      let east = _textAdventure.map.find(location => location._x === posX + 1 && location._y === posY);
      let south = _textAdventure.map.find(location => location._x === posX && location._y === posY + 1);
      let west = _textAdventure.map.find(location => location._x === posX - 1 && location._y === posY);

      let countChars: number | undefined = 0
      countChars = west?._title.length;
      if (countChars == undefined) {
        countChars = 0;
      }
      else
        countChars += 6;

      if (north != undefined) {
        let northTextLen: number = north._title.length;
        let titleOffset: number = countChars - Math.floor(northTextLen / 2);
        if (titleOffset < 0)
          titleOffset = 0;
        ConsoleHandling.printInput(Array(titleOffset).fill("\xa0").join("") + north._title);
        ConsoleHandling.printInput(Array(countChars).fill("\xa0").join("") + "|");
        ConsoleHandling.printInput(Array(countChars).fill("\xa0").join("") + "N");
      }

      if (west != undefined) {
        if (east != undefined) {
          ConsoleHandling.printInput(west._title + " ―― W   E ―― " + east._title);
        }
        else
          ConsoleHandling.printInput(west._title + " ―― W")
      }
      else if (east != undefined) {
        ConsoleHandling.printInput("  E ―― " + east._title)
      }

      if (south != undefined) {

        ConsoleHandling.printInput(Array(countChars).fill("\xa0").join("") + "S");
        ConsoleHandling.printInput(Array(countChars).fill("\xa0").join("") + "|");
        let southTextLen: number = south._title.length;
        let titleOffset: number = countChars - Math.floor(southTextLen / 2);
        if (titleOffset < 0)
          titleOffset = 0;
        ConsoleHandling.printInput(Array(titleOffset).fill("\xa0").join("") + south._title);
      }

      ConsoleHandling.printInput("");
      let answer: string = await ConsoleHandling.question("Where do you want to go next? [n/e/s/w] Or do you want to end? [end] ");

      switch (answer.toLowerCase()) {
        case "n":
        case "north":
          if (north == undefined)
            ConsoleHandling.printInput("You are not allowed to go in this direction");
          else {
            _textAdventure.turnCounter++;
            posY--;
          }
          break;
        case "e":
        case "east":
          if (east == undefined)
            ConsoleHandling.printInput("You are not allowed to go in this direction");
          else {
            _textAdventure.turnCounter++;
            posX++;
          }
          break;
        case "s":
        case "south":
          if (south == undefined)
            ConsoleHandling.printInput("You are not allowed to go in this direction");
          else {
            _textAdventure.turnCounter++;
            posY++;
          }
          break;
        case "w":
        case "west":
          if (west == undefined)
            ConsoleHandling.printInput("You are not allowed to go in this direction");
          else {
            _textAdventure.turnCounter++;
            posX--;
          }
          break;
        case "end":
          isPlaying = false;
          break;
        default:
          ConsoleHandling.printInput("This is not a valid input.");
          break;
      }
    }
    _textAdventure.playCounter++;
    let textAdventureReplace: number = this._textAdventures.findIndex(textAdventure => textAdventure.textAdventureId === _textAdventure.textAdventureId);
    console.log(_textAdventure);
    console.log(textAdventureReplace);
    this._textAdventures[textAdventureReplace] = _textAdventure;
    FileHandler.writeFile("../data/TextAdventure.json", this._textAdventures);
  }

  public ShowStatistics(): void {
    let userTextAdventures: TextAdventure[] = this._textAdventures.filter(textAdventure => textAdventure.creatorUserId === this._currentUser.userId);
    
  }

  public async GoNext(): Promise<void> {
    let answer: string = await ConsoleHandling.question("Back to overview? [y/n]");
    switch (answer.toLowerCase()) {
      case "y":
      case "yes":
      default:
        if (this._userState == UserState.LOGGEDIN)
          this.ShowRegisteredFunctionalities();
        else
          this.ShowFunctionalities();
        break;
      case "n":
      case "no":
        ConsoleHandling.closeConsole()
        break;
    }
  }
}