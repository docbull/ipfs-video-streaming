const eslint = require("eslint")
const test = require("tape")
const eslintrc = require("..")

test("load config in eslint to validate all rule syntax is correct", function (t) {
  var cli = new eslint.CLIEngine({
    useEslintrc: false,
    baseConfig: eslintrc,
  })

  var code = "var foo = 1\nvar bar = function () {}\nbar(foo)\n"

  t.equal(cli.executeOnText(code).errorCount, 0)
  t.end()
})
