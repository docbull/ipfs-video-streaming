
// Type definitions for chai-parentheses, forked from dirty-chai
// Project: https://github.com/achingbrain/dirty-chai
// TypeScript Version: 3.0

/// <reference types="chai" />
/// <reference types="chai-as-promised" />

declare global {
  namespace Chai {
      interface LanguageChains {
          always: Assertion;
      }

      interface Assertion {
          (message?: string): Assertion;
          ensure: Assertion;
      }

      interface PromisedAssertion extends Eventually, PromiseLike<any> {
          (message?: string): PromisedAssertion;
          ensure: PromisedAssertion;
      }
  }
}

declare const parentheses: Chai.ChaiPlugin;
export = parentheses;
