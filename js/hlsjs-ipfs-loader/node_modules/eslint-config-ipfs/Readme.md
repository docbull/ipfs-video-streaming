# eslint-config-ipfs

![Node.js CI][node.js ci]
[![package][version.icon]][package.url]
[![styled with prettier][prettier.icon]][prettier.url]

This package provides IPFS's .eslintrc as an extensible shared config.

## Usage

Provided configuration contains ESLint rules followed by JS libraries in the JS IPFS ecosystem. It provides slightly separate rule sets for `.js` and `.ts` files. To use this configuration you'll need `.eslintrc` file in your project
root with a following content:

```json
{
  "extends": "ipfs"
}
```

If you use [AEgir][] this config will comes with it, so above `.eslintrc` is only thing you'll need. If you choose to use ESLint directly, you'll need to add this package to your (dev) dependcies and satisfy "typescript" optional peer dependency yourself.

### JS only setup

If you do not have `.ts` files in your tree chances are you don't care about typescript and don't want to add "typescript" dependency. In that case you can use another `.eslintrc` configuration with a following content:

```json
{
  "extends": "ipfs/js"
}
```

[node.js ci]: https://github.com/ipfs/eslint-config-ipfs/workflows/Node.js%20CI/badge.svg
[version.icon]: https://img.shields.io/npm/v/eslint-config-ipfs.svg
[package.url]: https://npmjs.org/package/eslint-config-ipfs
[downloads.image]: https://img.shields.io/npm/dm/eslint-config-ipfs.svg
[downloads.url]: https://npmjs.org/package/eslint-config-ipfs
[prettier.icon]: https://img.shields.io/badge/styled_with-prettier-ff69b4.svg
[prettier.url]: https://github.com/prettier/prettier
[ts-jsdoc]: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
[aegir]: https://github.com/ipfs/aegir "Automated JavaScript project management."
