// this objects are instances of a singleton pattern
import ConsoleHandling from "./classes/ConsoleHandling";
import FileHandler from "./classes/FileHandler";
import * as bcrypt from "bcrypt";
import { TextAdventure } from "./classes/TextAdventure";
import { User } from "./classes/User";
import { Location } from "./types/Location.type";
import { TextAdventureDao } from "./types/TextAdventureDao.type";
import { UserDao } from "./types/UserDao.type";
import { v4 } from "uuid";
import { NullUser } from "./classes/NullUser";
import { IsValidUsername } from "./ValidateUserName";
import { UserState } from "./enums/UserState";

export class TextAdventureDatabase {
  private _textAdventures: TextAdventure[] = [];
  private _users: User[] = [];
  private _currentUser: User = new NullUser();
  private _userState: UserState = UserState.NOTLOGGEDIN;

  constructor() {
    let textAdventureJson: TextAdventureDao[] = FileHandler.ReadArrayFile("../data/TextAdventure.json");
    let userJson: UserDao[] = FileHandler.ReadArrayFile("../data/User.json");

    for (let textAdventure of textAdventureJson) {
      this._textAdventures.push(new TextAdventure(textAdventure));
    }

    for (let user of userJson) {
      this._users.push(new User(user));
    }
  }

  public async ShowFunctionalities(): Promise<void> {
    let answer: string = await ConsoleHandling.ShowPossibilities(
      [
        "1. Search text adventure by title",
        "2. List all text adventures",
        "3. Login",
        "4. Register"
      ],
      "Which function do you want to use?: ");

    this.HandleAnswer(answer);
  }

  private async ShowRegisteredFunctionalities(): Promise<void> {
    let answer: string = await ConsoleHandling.ShowPossibilities(
      [
        "1. Search text adventure by title",
        "2. List all text adventures",
        "3. Create text adventure",
        "4. Show statistics",
        "5. Log out"
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
        break;
      case "5":
        this._userState = UserState.NOTLOGGEDIN;
        this._currentUser = new NullUser();
        break;
      default:
        ConsoleHandling.PrintInput("Invalid answer. Try again.");
        break;
    }
    await this.GoNext();
  }

  private async HandleAnswer(answer: string) {
    switch (answer) {
      case "1":
        await this.SearchTextAdventureByTitle();
        break;
      case "2":
        await this.ListAllTextAdventures();
        break;
      case "3":
        await this.Login();
        break;
      case "4":
        await this.Register();
        break;
      default:
        break;
    }
    await this.GoNext();
  }

  private async SearchTextAdventureByTitle(): Promise<void> {
    let title: string = await ConsoleHandling.Question("Which title are you looking for? ");
    let foundTextAdventure: TextAdventure | undefined = this._textAdventures.find(textadventure => textadventure.title === title);

    if (foundTextAdventure == undefined) {
      ConsoleHandling.PrintInput("There is no text adventure for your search: " + title);
      return;
    }

    let answer: string = await ConsoleHandling.Question("Do you want to start text adventure: " + foundTextAdventure.title + "? [y/n]");

    switch (answer.toLowerCase()) {
      case "y":
      case "yes":
        await this.PlayTextAdventure(foundTextAdventure);
        break;
      case "n":
      case "no":
        await this.GoNext();
        break;
      default:
        await this.GoNext();
    }
  }

  private async ListAllTextAdventures(): Promise<void> {
    let count: number = 0;
    while (true) {
      let possibilites: string[] = [];
      for (let i = count; i < count + 5; i++) {
        if (this._textAdventures[i] != undefined)
          possibilites.push(this._textAdventures[i].title + "(" + this._textAdventures[i].x + " X " + this._textAdventures[i].y + ")" + " [" + (i + 1) + "]");
      }

      possibilites.push("Or do you want to return? [r/return]");
      if (this._textAdventures.length > count + 5)
        possibilites.push("Do you want to see next 5? [y]");

      let answer: string = await ConsoleHandling.ShowPossibilities(possibilites, "Which text adventure do you want to start? [number] ");
      if (answer.toLowerCase() === "r" || answer.toLowerCase() === "return")
        return;

      if (answer.toLowerCase() === "y") {
        count += 5;
        continue;
      }

      if (!Number.isFinite(Number(answer)) || possibilites.length - 1 < Number(answer)) {
        ConsoleHandling.PrintInput("Please enter a valid number.");
        continue;
      }
      
      await this.PlayTextAdventure(this._textAdventures[Number(answer) - 1]);
      break;
    }
  }

  private async Login(): Promise<void> {
    let username: string = await ConsoleHandling.Question("What is your username? ");
    let password: string = await ConsoleHandling.Question("What is your password? ");

    let userFound: User | undefined = this._users.find(user => user.username === username && bcrypt.compareSync(password, user.password));

    if (userFound == undefined) {
      ConsoleHandling.PrintInput("Login failed");
      return;
    }

    ConsoleHandling.PrintInput("Login successful");
    this._userState = UserState.LOGGEDIN;
    this._currentUser = userFound;
  }

  private async Register(): Promise<void> {
    let username: string = await ConsoleHandling.Question("What is your username? ");
    let userFound: User | undefined = this._users.find(user => user.username === username);

    if (userFound) {
      ConsoleHandling.PrintInput("This username already exists, you will return now.");
      return;
    }

    if (!IsValidUsername(username)) {
      ConsoleHandling.PrintInput("Special characters are not allowed in username.");
      return;
    }

    let password: string = await ConsoleHandling.Question("What is your password? ");

    let hash: string = bcrypt.hashSync(password, 10);
    console.log(hash);
    let userId: string = v4();
    let newUserDao: UserDao = { _username: username, _password: hash, _userId: userId };
    let newUser: User = new User(newUserDao);

    this._users.push(newUser);
    FileHandler.WriteFile("../data/user.json", this._users);
    ConsoleHandling.PrintInput("Successful registration.");
  }

  private async CreateTextAdventureMap(): Promise<void> {
    let title: string = await ConsoleHandling.Question("What is the title of the text adventure? ");
    let x: number = Number(await ConsoleHandling.Question("What is the x value of the text adventure? "));
    let y: number = Number(await ConsoleHandling.Question("What is the y value of the text adventure? "));

    let map: Location[] = [];
    let consoleMap: string = "";
    for (let vertikal = 1; vertikal < y + 1; vertikal++) {
      for (let horizontal = 1; horizontal < x + 1; horizontal++) {
        let location: string = await ConsoleHandling.Question("Which location do you want to add for (" + vertikal + "/" + horizontal + ") ");
        let newLocation: Location = { _y: vertikal, _x: horizontal, _title: location };
        map.push(newLocation);
        consoleMap += location + "(" + vertikal + "/" + horizontal + ")";
        if (horizontal !== x)
          consoleMap += "|";
        ConsoleHandling.PrintInput(consoleMap);
      }
      consoleMap += "\n";
    }
    let startPosHor: string = await ConsoleHandling.Question("Which is the start point horizontal? ");
    let startX: number = Number(startPosHor);

    let startPosVert: string = await ConsoleHandling.Question("Which is the start point vertikal? ");
    let startY: number = Number(startPosVert);

    let textAdventureId: string = v4();
    let newTextAdventureDao: TextAdventureDao = { _title: title, _x: x, _y: y, _map: map, _startX: startX, _startY: startY, _textAdventureId: textAdventureId, _creatorUserId: this._currentUser.userId, _playCounter: 0, _turnCounter: 0 };
    let newTextAdventure: TextAdventure = new TextAdventure(newTextAdventureDao);

    this._textAdventures.push(newTextAdventure);
    FileHandler.WriteFile("../data/TextAdventure.json", this._textAdventures);
    ConsoleHandling.PrintInput("Successfully created text adventure.");
  }

  private async PlayTextAdventure(_textAdventure: TextAdventure): Promise<void> {
    await _textAdventure.PlayTextAdventure();
    _textAdventure.playCounter++;
    let textAdventureReplace: number = this._textAdventures.findIndex(textAdventure => textAdventure.textAdventureId === _textAdventure.textAdventureId);
    this._textAdventures[textAdventureReplace] = _textAdventure;
    FileHandler.WriteFile("../data/TextAdventure.json", this._textAdventures);
  }

  private ShowStatistics(): void {
    let userTextAdventures: TextAdventure[] = this._textAdventures.filter(textAdventure => textAdventure.creatorUserId === this._currentUser.userId);

    if (userTextAdventures.length === 0) {
      ConsoleHandling.PrintInput("You have not created any text adventures yet");
      return;
    }

    for (let textAdventure of userTextAdventures) {
      ConsoleHandling.PrintInput(textAdventure.title + " Player: " + textAdventure.playCounter + " average turns: " + textAdventure.turnCounter / textAdventure.playCounter);
    }
  }

  private async GoNext(): Promise<void> {
    let answer: string = await ConsoleHandling.Question("Back to overview? [y/n]");
    switch (answer.toLowerCase()) {
      case "y":
      case "yes":
      default:
        if (this._userState === UserState.LOGGEDIN)
          this.ShowRegisteredFunctionalities();
        else
          this.ShowFunctionalities();
        break;
      case "n":
      case "no":
        ConsoleHandling.CloseConsole()
        break;
    }
  }
}