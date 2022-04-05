This library converts and the AST (Abstract Syntax Tree) of an
ESM program to CommonJS.

Note: Dynamic imports are not yet supported.

```js
import acorn from 'acorn'
import astring from 'astring'
import convert from 'esm-ast-to-cjs'

const script = `
import test from 'test'
export default test
`

const opts = { sourceType: 'module' }
const ast = acorn.parse(script, opts)
convert(ast)
const cjs = astring.generate(ast)
console.log(cjs)
// const test = require('test');\nmodule.exports = test'\n
```
