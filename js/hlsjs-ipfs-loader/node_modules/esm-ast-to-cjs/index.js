const copy = o => JSON.parse(JSON.stringify(o))

const types = {}

const exportExpression = {
  type: 'AssignmentExpression',
  operator: '=',
  left: {
    type: 'MemberExpression',
    object: { type: 'Identifier', name: 'module' },
    property: { type: 'Identifier', name: 'exports' },
    computed: false
  }
}

types.ExportDefaultDeclaration = node => {
  const ast = copy(exportExpression)
  ast.right = node.declaration
  return ast
}

types.ExportNamedDeclaration = node => {
  const ast = copy(exportExpression)
  const properties = []
  ast.right = {
    type: 'ObjectExpression',
    properties
  }
  for (const specifier of node.specifiers) {
    /* c8 ignore next */
    if (specifier.type !== 'ExportSpecifier') /* c8 ignore next */ throw new Error('Not implemented')
    const { name } = specifier.local
    if (name === specifier.exported.name) {
      properties.push({
        type: 'Property',
        method: false,
        shorthand: true,
        computed: false,
        key: { type: 'Identifier', name },
        kind: 'init',
        value: { type: 'Identifier', name }
      })
    } else {
      properties.push({
        type: 'Property',
        method: false,
        shorthand: false,
        computed: false,
        key: { type: 'Identifier', name: specifier.exported.name },
        kind: 'init',
        value: { type: 'Identifier', name }
      })
    }
  }
  return ast
}

const localId = name => ({ type: 'Identifier', name })

const requireExpression = (id, imported) => ({
  type: 'VariableDeclaration',
  kind: 'const',
  declarations: [{
    type: 'VariableDeclarator',
    id,
    init: {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'require' },
      arguments: [{ type: 'Literal', value: imported, raw: `'${imported}'` }]
    }
  }]
})

const propExpression = props => ({
  type: 'ObjectPattern',
  properties: props.map(name => ({
    type: 'Property',
    method: false,
    shorthand: true,
    computed: false,
    kind: 'init',
    key: { type: 'Identifier', name },
    value: { type: 'Identifier', name }
  }))
})

types.ImportDeclaration = node => {
  const imported = node.source.value
  const statements = []
  const props = []
  for (const specifier of node.specifiers) {
    const { name } = specifier.local
    if (specifier.type === 'ImportDefaultSpecifier') {
      /* c8 ignore next */
      if (node.specifiers.length > 1) /* c8 ignore next */ throw new Error('not implemented')
      return [requireExpression(localId(name), imported)]
    } else if (specifier.type === 'ImportSpecifier') {
      if (name === specifier.imported.name) {
        props.push(name)
      } /* c8 ignore next */ else {
        /* c8 ignore next */
        throw new Error('not implemented')
        /* c8 ignore next */
      }
    } /* c8 ignore next */ else {
      /* c8 ignore next */
      throw new Error('not implemented')
      /* c8 ignore next */
    }
  }
  if (props.length) {
    statements.push(requireExpression(propExpression(props), imported))
  }
  return statements
}

export default ast => {
  let i = 0
  for (const node of ast.body) {
    if (types[node.type]) {
      const ret = types[node.type](node)
      if (Array.isArray(ret)) {
        ast.body.splice(i, 1, ...ret)
        i += (ret.length - 1)
      } else {
        ast.body[i] = ret
      }
    } else {
      // console.log(node)
    }
    i++
  }
  return ast
}
