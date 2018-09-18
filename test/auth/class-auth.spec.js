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

  if (!process.env.SYSTEM_TEST) {
    test.nock('https://api.tillhub.com').post('/api/v0/users/login').reply(200, {
      'status': 200,
      'msg': 'Authentication was good.',
      'request': {
        'host': 'staging-api.tillhub.com',
        'id': '11a12a8f-96bf-4380-aa55-301b7806f66f'
      },
      'user': {
        'id': 'someuuid',
        'name': 'test-test',
        'legacy_id': 'anotheruuid'
      },
      'valid_password': true,
      'token': 'sometoken',
      'token_type': 'Bearer',
      'expires_at': '2018-06-05T11:11:27.000Z'
    })
  }

  th.init((err, authResponse, client, authInstance) => {
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
