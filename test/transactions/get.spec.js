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

test('v0: Transactions: can fetch some transactions', function (t) {
  const Tillhub = require('../../lib/').Tillhub
  const Transactions = require('../../lib/v0/transactions').Transactions

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

    test.nock('https://api.tillhub.com').get('/api/v0/transactions/anotheruuid/legacy').reply(200, {
      'status': 200,
      'msg': 'Fetched all transactions.',
      'count': 0,
      'results': [
        {
          '_id': 'someid'
        }
      ]
    })
  }

  th.init((err, authResponse, client, authInstance) => {
    t.error(err)

    const transactions = th.transactions()
    t.ok(transactions)
    t.ok(transactions.http)
    t.ok(transactions instanceof Transactions)

    transactions.getAll((err, data, metadata, next) => {
      t.error(err)

      t.ok(Array.isArray(data))
      t.ok(data.length)
      t.equals(next, null)
      t.ok(Number.isFinite(metadata.count))

      t.end()
    })
  })
})

test('v0: Transactions: can fetch paged transactions', function (t) {
  const Tillhub = require('../../lib/').Tillhub
  const Transactions = require('../../lib/v0/transactions').Transactions

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

    test.nock('https://api.tillhub.com')
      .get('/api/v0/transactions/anotheruuid/legacy?limit=2')
      .reply(200, {
        'status': 200,
        'msg': 'Fetched all transactions.',
        'cursor': {
          'next': 'https://api.tillhub.com/api/v0/transactions/anotheruuid/legacy?limit=2&cursor_field=-id&cursor=123'
        },
        'count': 2,
        'results': [
          {
            '_id': 'someid'
          },
          {
            '_id': 'someid'
          }
        ]
      })
  }

  th.init((err, authResponse, client, authInstance) => {
    t.error(err)

    const transactions = th.transactions()
    t.ok(transactions)
    t.ok(transactions.http)
    t.ok(transactions instanceof Transactions)

    transactions.getAll({ limit: 2 }, (err, data, metadata, next) => {
      t.error(err)

      t.ok(Array.isArray(data))
      t.equals(data.length, 2)
      t.ok(Number.isFinite(metadata.count))
      t.equals(metadata.count, 2)

      t.ok(next)
      t.ok(typeof next === 'function')

      if (!process.env.SYSTEM_TEST) {
        test.nock('https://api.tillhub.com').get('/api/v0/transactions/anotheruuid/legacy?limit=2&cursor_field=-id&cursor=123').reply(200, {
          'status': 200,
          'msg': 'Fetched all transactions.',
          'cursor': {
            'next': 'https://api.tillhub.com/api/v0/transactions/anotheruuid/legacy?limit=2&cursor_field=-id&cursor=456'
          },
          'count': 2,
          'results': [
            {
              '_id': 'someid'
            },
            {
              '_id': 'someid'
            }
          ]
        })
      }

      next((err) => {
        t.error(err, data, metadata, next)

        t.ok(Array.isArray(data))
        t.equals(data.length, 2)
        t.ok(Number.isFinite(metadata.count))
        t.equals(metadata.count, 2)

        t.ok(next)
        t.ok(typeof next === 'function')

        t.end()
      })
    })
  })
})
