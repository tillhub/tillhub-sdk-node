const path = require('path')
const tape = require('tape')
const tapeNock = require('tape-nock')
const test = tapeNock(tape, {
  fixtures: path.join(__dirname, 'fixtures/login')
})

let user = {
  username: 'test@example.com',
  password: '12345678'
}

if (process.env.SYSTEM_TEST) {
  user.username = process.env.SYSTEM_TEST_USERNAME || user.username
  user.password = process.env.SYSTEM_TEST_PASSWORD || user.password
}

test('root: Cannot init without credentials', function (t) {
  const Tillhub = require('../../lib/').Tillhub

  const th = new Tillhub()

  th.init((err) => {
    t.ok(err)
    t.equals(err.message, 'insufficient credentials')
    t.equals(err.status, 422)
    t.end()
  })
})

test('root: Can init with auth credentials', function (t) {
  const Tillhub = require('../../lib/').Tillhub

  const th = new Tillhub({
    credentials: {
      ...user
    }
  })

  th.init((err, client, authInstance) => {
    t.error(err)

    t.ok(th.auth)
    t.ok(th.auth.token)
    t.ok(th.auth.user)
    t.ok(th.user)
    t.ok(th.http)
    t.ok(authInstance === th.auth)
    t.end()
  })
})
