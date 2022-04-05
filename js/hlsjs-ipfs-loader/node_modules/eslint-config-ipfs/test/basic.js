var eslintrc = require("../")
var test = require("tape")

test("test basic properties of config", function (t) {
  t.ok(Array.isArray(eslintrc.overrides))
  t.end()
})
