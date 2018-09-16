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

test('v1: Templates: can fetch some templates', function (t) {
  const Tillhub = require('../../lib/').Tillhub
  const Templates = require('../../lib/v1/templates').Templates

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

    test.nock('https://api.tillhub.com').get('/api/v1/templates/anotheruuid').reply(200, {
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

  th.init((err, client, authInstance) => {
    t.error(err)

    const templates = th.templates()
    t.ok(templates)
    t.ok(templates.http)
    t.ok(templates instanceof Templates)

    templates.getAll((err, data, metadata) => {
      t.error(err)

      t.ok(Array.isArray(data))
      t.ok(data.length)
      t.ok(Number.isFinite(metadata.count))

      t.end()
    })
  })
})
