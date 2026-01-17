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

declare module 'bs58' {
  export function decode(input: string): Uint8Array;
  export function encode(input: Uint8Array | number[]): string;
  export default { decode, encode };
}
