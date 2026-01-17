declare module 'privacycash' {
  export class PrivacyCash {
    constructor(config: any);
    publicKey: any;
    deposit(params: any): Promise<any>;
    withdraw(params: any): Promise<any>;
    getPrivateBalance(): Promise<any>;
    setLogger(fn: (level: string, message: string) => void): void;
  }
}
