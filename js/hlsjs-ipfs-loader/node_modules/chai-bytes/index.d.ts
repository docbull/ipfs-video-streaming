/// <reference types="chai" />

declare global {
  namespace Chai {
    interface Assertion extends LanguageChains, NumericComparison, TypeComparison {
      equalBytes(bytes: string | ArrayLike<number>): Assertion;
    }

    interface Assert {
      equalBytes(buffer: Uint8Array, bytes: string | ArrayLike<number>, msg?: string): void;
    }
  }
}

declare function chaiBytes(chai: any): any;
export = chaiBytes;
