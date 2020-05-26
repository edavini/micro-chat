import { User } from './User';

export class Message {

    constructor(
      public timestamp: Date,
      public message: string,
      public uid: string,
      public user?: User
    ) {  }
  
  }
  