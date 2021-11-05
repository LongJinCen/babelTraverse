const parser = require("@babel/parser")
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
    const topBinaryExpressionPath = path.findParent(path => !path.isBinaryExpression())

    // ...do something to get the finalKey
    // this final key look like this
    const finalKey = 'tes1{0}test2{1}test3'
    const replaceNode = callExpression(
      identifier("$i18n"),
      [stringLiteral(finalKey)]
    )
    
    topBinaryExpressionPath.replaceWith(replaceNode)
    topBinaryExpressionPath.skip()
  }
})