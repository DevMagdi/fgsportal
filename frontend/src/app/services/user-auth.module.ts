export class UserAuth {
    constructor(
      public key: string,
      public email: string,
      public username: string,
      public accType: string,
      public department: string,
      public accRole: string,
      public accPosition: string,
      public refreshRequired: boolean | number,
      public photoURL: string,
      private _token: string,
    ) {}
  
    get token() {
      return this._token;
    }
  }
  