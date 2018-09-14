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

    test.nock('https://api.tillhub.com')
      .patch('/api/v1/configurations/anotheruuid/2628e479-c4ca-4e55-b5ae-231ccf60e79f').reply(200, {
        'status': 200,
        'msg': 'Configuration altered.',
        'count': 0,
        'results': [{
          id: '2628e479-c4ca-4e55-b5ae-231ccf60e79f',
          client_id: null,
          name: 'new name',
          configurations: null,
          settings: { language: 'de-DE' },
          hooks: []
        }],
        'change': [
          { op: 'remove', path: '/hooks/0' },
          { op: 'replace', path: '/name', value: 'new name' },
          { op: 'replace', path: '/settings/language', value: 'de-DE' }
        ]
      })
  }

  const originalObject = {
    name: 'example',
    hooks: [
      {
        some: 'value'
      }
    ],
    settings: { language: 'en-GB' }
  }

  const modifiedObject = {
    name: 'new name',
    hooks: [],
    settings: { language: 'de-DE' }
  }

  th.init((err, client, authInstance) => {
    t.error(err)

    const config = th.configurations()
    t.ok(config)
    t.ok(config.http)
    t.ok(config instanceof Configurations)

    config.patch(originalObject, modifiedObject, {id: '2628e479-c4ca-4e55-b5ae-231ccf60e79f'}, (err, body) => {
      t.error(err)
      t.equal(body.status, 200)
      t.equal(body.msg, 'Configuration altered.')
      t.notEqual(body.results.length, 0)
      t.ok(body.change)
      t.end()
    })
  })
})

test('Configuration - PATCH: should throw an error if id is missing', function (t) {
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

    test.nock('https://api.tillhub.com')
      .patch('/api/v1/configurations/anotheruuid/2628e479-c4ca-4e55-b5ae-231ccf60e79f').reply(200, {
        'status': 200,
        'msg': 'Configuration altered.',
        'count': 0,
        'results': [{
          id: '2628e479-c4ca-4e55-b5ae-231ccf60e79f',
          client_id: null,
          name: 'new name',
          configurations: null,
          settings: { language: 'de-DE' },
          hooks: []
        }],
        'change': [
          { op: 'remove', path: '/hooks/0' },
          { op: 'replace', path: '/name', value: 'new name' },
          { op: 'replace', path: '/settings/language', value: 'de-DE' }
        ]
      })
  }

  const originalObject = {
    name: 'example',
    hooks: [
      {
        some: 'value'
      }
    ],
    settings: { language: 'en-GB' }
  }

  const modifiedObject = {
    name: 'new name',
    hooks: [],
    settings: { language: 'de-DE' }
  }

  th.init((err, client, authInstance) => {
    t.error(err)

    const config = th.configurations()
    t.ok(config)
    t.ok(config.http)
    t.ok(config instanceof Configurations)

    config.patch(originalObject, modifiedObject, {}, (err, body) => {
      t.ok(err, 'expect to get error returned')
      t.equal(err.message, `Tillhub: query 'id' must be provided`)
      t.end()
    })
  })
})

test('Configuration - PATCH: should throw an error if object to diff is conflict', function (t) {
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

    test.nock('https://api.tillhub.com')
      .patch('/api/v1/configurations/anotheruuid/2628e479-c4ca-4e55-b5ae-231ccf60e79f').reply(200, {
        'status': 200,
        'msg': 'Configuration altered.',
        'count': 0,
        'results': [{
          id: '2628e479-c4ca-4e55-b5ae-231ccf60e79f',
          client_id: null,
          name: 'new name',
          configurations: null,
          settings: { language: 'de-DE' },
          hooks: []
        }],
        'change': [
          { op: 'remove', path: '/hooks/0' },
          { op: 'replace', path: '/name', value: 'new name' },
          { op: 'replace', path: '/settings/language', value: 'de-DE' }
        ]
      })
  }

  const originalObject = {
    name: 'example',
    hooks: [
      {
        some: 'value'
      }
    ],
    settings: { language: 'en-GB' }
  }

  th.init((err, client, authInstance) => {
    t.error(err)

    const config = th.configurations()
    t.ok(config)
    t.ok(config.http)
    t.ok(config instanceof Configurations)

    config.patch(originalObject, null, {id: '2628e479-c4ca-4e55-b5ae-231ccf60e79f'}, (err, body) => {
      t.ok(err, 'expect to get error returned')
      t.equal(err.message, 'could not generate JSON patch')
      t.end()
    })
  })
})
