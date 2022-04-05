'use strict'

module.exports = {
  extends: 'standard',
  parserOptions: {
    sourceType: 'script'
  },
  env: {
    es2020: true,
    browser: true,
    node: true
  },
  plugins: [
    'no-only-tests',
    'jsdoc'
  ],
  rules: {
    strict: ['error', 'safe'],
    curly: 'error',
    'block-scoped-var': 'error',
    complexity: 'warn',
    'default-case': 'error',
    'guard-for-in': 'warn',
    'linebreak-style': ['warn', 'unix'],
    'no-alert': 'error',
    'no-console': 'error',
    'no-continue': 'warn',
    'no-div-regex': 'error',
    'no-empty': 'warn',
    'no-extra-semi': 'error',
    'no-implicit-coercion': 'error',
    'no-loop-func': 'error',
    'no-nested-ternary': 'warn',
    'no-script-url': 'error',
    'no-warning-comments': 'warn',
    'max-nested-callbacks': ['error', 4],
    'max-depth': ['error', 4],
    'require-yield': 'error',
    // plugins
    'no-only-tests/no-only-tests': 'error',
    'jsdoc/check-alignment': 'error',
    'jsdoc/check-examples': 'off',
    'jsdoc/check-indentation': 'error',
    'jsdoc/check-param-names': 'error',
    'jsdoc/check-syntax': 'error',
    'jsdoc/check-tag-names': ['error', { definedTags: ['internal', 'packageDocumentation'] }],
    'jsdoc/check-types': 'error',
    'jsdoc/implements-on-classes': 'error',
    'jsdoc/match-description': 'off',
    'jsdoc/newline-after-description': 'error',
    'jsdoc/no-types': 'off',
    // Note: no-undefined-types rule causes to many false positives:
    // https://github.com/gajus/eslint-plugin-jsdoc/issues/559
    // And it is also unaware of many built in types
    // https://github.com/gajus/eslint-plugin-jsdoc/issues/280
    'jsdoc/no-undefined-types': 'off',
    'jsdoc/require-returns-type': 'off',
    'jsdoc/require-description': 'off',
    'jsdoc/require-description-complete-sentence': 'off',
    'jsdoc/require-example': 'off',
    'jsdoc/require-hyphen-before-param-description': 'error',
    'jsdoc/require-jsdoc': 'off',
    'jsdoc/require-param': 'error',
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-param-name': 'error',
    'jsdoc/require-param-type': 'error',
    // Note: Do not require @returns because TS often can infer return types and
    // in many such cases it's not worth it.
    'jsdoc/require-returns': 'off',
    'jsdoc/require-returns-check': 'error',
    'jsdoc/require-returns-description': 'off',
    // Note: At the moment type parser used by eslint-plugin-jsdoc does not
    // parse various forms correctly. For now warn on invalid type froms,
    // should revisit once following issue is fixed:
    // https://github.com/jsdoctypeparser/jsdoctypeparser/issues/50
    'jsdoc/valid-types': 'off'

  },
  settings: {
    jsdoc: {
      mode: 'typescript',
      tagNamePreference: {
        augments: {
          message: '@extends is to be used over @augments as it is more evocative of classes than @augments',
          replacement: 'extends'
        }
      },
      structuredTags: {
        extends: {
          type: true
        }
      }
    }
  }
}
