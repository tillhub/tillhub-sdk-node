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

test('v0: Vouchers: can fetch some vouchers', function (t) {
  const Tillhub = require('../../lib/').Tillhub
  const Vouchers = require('../../lib/v0/vouchers').Vouchers

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
        'host': 'api.tillhub.com',
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

    test.nock('https://api.tillhub.com').get('/api/v0/vouchers/anotheruuid').reply(200, {
      'status': 200,
      'msg': 'Fetched all templates.',
      'count': 0,
      'results': [
        {
          'id': 'someid'
        }
      ]
    })
  }

  th.init((err, authResponse, client, authInstance) => {
    t.error(err)

    const vouchers = th.vouchers()
    t.ok(vouchers)
    t.ok(vouchers.http)
    t.ok(vouchers instanceof Vouchers)

    vouchers.getAll((err, data, metadata) => {
      t.error(err)

      t.ok(Array.isArray(data))
      t.ok(data.length)
      t.ok(Number.isFinite(metadata.count))

      t.end()
    })
  })
})
