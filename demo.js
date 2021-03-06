const parser = require("@babel/parser")
const generate = require("@babel/generator").default
const traverse = require("@babel/traverse").default

const {
  callExpression,
  identifier,
  stringLiteral,
} = require("@babel/types");

const code = `
  const value = 1
  const str = 'test1' + value + 'test2' + value + 'test3'
`

const ast = parser.parse(code)

traverse(ast, {
  StringLiteral(path) {

    console.log('this is a string value: ', path.node.value);

    // find the whole  'test1' + value + 'test2' + value + 'test3'  BinaryExpression
    const topBinaryExpressionPath = path.findParent(path => !path.parentPath.isBinaryExpression())

    const finalKey = 'testkey'
    const replaceNode = callExpression(
      identifier("$i18n"),
      [stringLiteral('testkey')]
    )

    topBinaryExpressionPath.replaceWith(replaceNode)
    // skip the new node traverse
    topBinaryExpressionPath.skip()
  }
})

const result = generate(ast)
console.log(result.code);