const test = require('tape')

test('Can require and instantiate Auth', function (t) {
  t.doesNotThrow(() => {
    const Auth = require('../../').v0.Auth

    const auth = new Auth()
    t.ok(auth)
  })
  t.end()
})
