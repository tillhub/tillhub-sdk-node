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

test('v0.Auth: Can login with username password', function (t) {
  const Auth = require('../../lib/v0/auth').Auth

  const auth = new Auth()
  t.ok(auth)

  if (!process.env.SYSTEM_TEST) {
    test.nock('https://staging-api.tillhub.com').post('/api/v0/users/login').reply(200, {
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

  auth.loginBasic(user.username, user.password, (err, body, resp) => {
    t.error(err)

    t.ok(body)

    t.ok(body.token)
    t.ok(body.user)
    t.ok(body.user.id)
    t.equals(body.token_type, 'Bearer')
    t.end()
  })
})
