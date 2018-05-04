const test = require('tape')

test('Can require and instantiate', function (t) {
  t.doesNotThrow(() => {
    const T = require('../')
    const t = new T()
    t.ok(t)
  })
})
