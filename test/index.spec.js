const test = require('tape')

test('timing test', function (t) {
  t.plan(2)

  t.doesNotThrow(() => {
    const T = require('../')
    const t = new T()
    t.ok(t)
  })
})
