const test = require('tape')

test('Can require and instantiate', function (t) {
  t.doesNotThrow(() => {
    const Tillhub = require('../')
    const tillhub = new Tillhub()
    t.ok(tillhub)
  })
  t.end()
})
