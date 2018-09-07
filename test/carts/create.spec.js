const path = require('path')
const tape = require('tape')
const uuid = require('uuid')
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

test('v1: carts: can create cart from existing products', function (t) {
  const Tillhub = require('../../lib/').Tillhub
  const Carts = require('../../lib/v1/carts').Carts

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

    test.nock('https://api.tillhub.com').post('/api/v1/carts/anotheruuid')
      .reply(function (uri, requestBody, cb) {
        cb(null, [200, {
          'status': 200,
          'msg': 'Cart created.',
          'count': 1,
          'results': [
            {
              id: uuid.v4(),
              items: [
                {
                  tax: uuid.v4(),
                  account: uuid.v4(),
                  qty: 1,
                  product: requestBody.items[0].product
                }
              ]
            }
          ]
        }])
      })
  }

  th.init((err, client, authInstance) => {
    t.error(err)

    const carts = th.carts()
    t.ok(carts)
    t.ok(carts.http)
    t.ok(carts instanceof Carts)

    const cart = {
      items: [
        {
          // we assume that this product is actually existant
          id: uuid.v4(),
          qty: 1,
          currency: 'EUR'
        }
      ]
    }

    carts.create(cart, (err, data, metadata) => {
      t.error(err)

      t.ok(data)
      t.ok(data.items)

      t.equals(data.items.length, 1)
      t.equals(data.items[0].product, cart.items[0].product)
      t.deepEquals(data, metadata.results[0], 'will find all results in metadata, as fallback')
      t.ok(Number.isFinite(metadata.count))

      t.end()
    })
  })
})
