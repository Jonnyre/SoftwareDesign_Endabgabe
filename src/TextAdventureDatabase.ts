// this objects are instances of a singleton pattern
import ConsoleHandling from "./classes/ConsoleHandling";
import FileHandler from "./classes/FileHandler";
import { TextAdventure } from "./classes/TextAdventure";
import { User } from "./classes/User";
import { TextAdventureDao } from "./types/TextAdventureDao.type";
import { UserDao } from "./types/UserDao.type";

export class TextAdventureDatabase {
  private _textAdventures: TextAdventure[] = [];
  private _users: User[] = [];

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

  public async showFunctionalities(): Promise<void> {
    let answer: string = await ConsoleHandling.showPossibilities(
      [
        "1. Search text adventure by title",
        "2. List all text adventures",
        "3. Sign in",
        "4. Register"
      ],
      "Which function do you want to use? (default 1): ");

    this.handleAnswer(answer);
  }


  public async handleAnswer(answer: string) {
    switch (answer) {
      case "1":
        await this.SearchTextAdventureByTitle();
        break;
      case "2":
        this.ListAllTextAdventures();
        break;
      case "3":
        await this.SignIn();
        break;
      case "4":
        await this.Register();
        break;
      default:
        // this.showMoviesWithBoxOffice();
        break;
    }
    await this.goNext();
  }

  public async SearchTextAdventureByTitle(): Promise<void> {
    let title: string = await ConsoleHandling.question("Which title are you looking for? ");
    let foundTextAdventures: TextAdventure[] = this._textAdventures.filter(textadventure => textadventure.title.includes(title));

    let possibilities: string[] = [];
    foundTextAdventures.forEach(function(textAdventure, index) {
      possibilities.push(textAdventure.title + " [" + index + "]");
    });
    
    let nrTextAdventure: string =  await ConsoleHandling.showPossibilities(possibilities, "Which text adventure do u want to start? [number]");
    let textAdventure: TextAdventure = this._textAdventures[Number(nrTextAdventure)];
    ConsoleHandling.printInput("Text adventure: " + textAdventure.title);
  }

  public ListAllTextAdventures(): void {
    let count: number = 0;
    for (let i = count; i < count + 5; i++) {
      ConsoleHandling.printInput("Title: " + this._textAdventures[i].title);
    }
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
  }

  public async Register(): Promise<void> {
    let username: string = await ConsoleHandling.question("What is your username? ");
    let userFound: User | undefined = this._users.find(user => user.username === username);

    if (userFound) {
      ConsoleHandling.printInput("This username already exists, you will return now.");
      return;
    }

    if(!this.regNoSpecialCharacters.test(username)) {
      ConsoleHandling.printInput("Special characters are not allowed in username.");
      return;
    }

    let password: string = await ConsoleHandling.question("What is your password? ");
    let newUserDao: UserDao = { _username: username, _password: password };
    let newUser: User = new User(newUserDao);

    this._users.push(newUser);
    FileHandler.writeFile("../data/user.json", this._users);
    ConsoleHandling.printInput("Successful registration.");
  }



  public async goNext(): Promise<void> {
    let answer: string = await ConsoleHandling.question("Back to overview? [y/n]");
    switch (answer.toLowerCase()) {
      case "y":
      case "yes":
      default:
        this.showFunctionalities();
        break;
      case "n":
      case "no":
        ConsoleHandling.closeConsole()
        break;
    }
  }
}