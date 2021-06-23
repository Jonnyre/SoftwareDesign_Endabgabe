import { AbstractUser } from "./abstracts/AbstractUser";

export class NullUser extends AbstractUser {
    constructor() {
      super();
      
      this.username = "";
      this.password = "";
      this.userId = "";
    }
  }