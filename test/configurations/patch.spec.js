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

test('Configuration - PATCH: can get different of 2 objects', function (t) {
  const Tillhub = require('../../lib').Tillhub
  const Configurations = require('../../lib/v1/configurations').Configurations
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

    test.nock('https://api.tillhub.com').patch('/api/v1/configurations').reply(200, {
      'status': 200,
      'msg': 'Fetched all products.',
      'count': 0,
      'results': [
        {
          op: 'remove',
          path: '/hooks/0'
        },
        {
          op: 'replace',
          path: '/name',
          value: 'new name'
        },
        {
          op: 'replace',
          path: '/settings/language',
          value: 'de-DE'
        }
      ]
    })
  }

  const object1 = {
    name: 'example',
    hooks: [
      {
        some: 'value'
      }
    ],
    settings: { language: 'en-GB' }
  }

  const object2 = {
    name: 'new name',
    hooks: [],
    settings: { language: 'de-DE' }
  }

  const expectedObject = [
    { op: 'remove', path: '/hooks/0' },
    { op: 'replace', path: '/name', value: 'new name' },
    { op: 'replace', path: '/settings/language', value: 'de-DE' }
  ]

  th.init((err, client, authInstance) => {
    t.error(err)

    const config = th.configurations()
    t.ok(config)
    t.ok(config.http)
    t.ok(config instanceof Configurations)

    config.patch({ objectOne: object1, objectTwo: object2 }, (err, results) => {
      t.error(err)
      t.deepEqual(results, expectedObject)
      t.ok(Array.isArray(results))
      t.end()
    })
  })
})
