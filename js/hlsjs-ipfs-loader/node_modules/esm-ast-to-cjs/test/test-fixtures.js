import { promises as fs } from 'fs'
import acorn from 'acorn'
import astring from 'astring'
import main from '../index.js'
import { deepStrictEqual as same } from 'assert'

const { generate } = astring
const { parse } = acorn
const { readFile, readdir } = fs

export default async test => {
  const cjs = new Map()
  const mjs = new Map()
  const files = await readdir(new URL('fixtures', import.meta.url))
  for (const filename of files) {
    const url = new URL('fixtures/' + filename, import.meta.url)
    if (filename.endsWith('.cjs')) {
      cjs.set(filename, readFile(url))
    } else {
      mjs.set(filename, readFile(url))
    }
  }
  for (const [filename, filePromise] of mjs.entries()) {
    test(filename, async test => {
      const data = await filePromise
      const ast = parse(data, { sourceType: 'module' })
      main(ast)
      const output = generate(ast)
      const match = await cjs.get(filename.slice(0, filename.length - 3) + 'cjs')
      same(output, match.toString())
    })
  }
}
