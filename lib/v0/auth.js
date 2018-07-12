const EventEmitter = require('events')
const request = require('retry-request')

const errors = require('../errors')

/**
 * Authenticate an app via different auth strategies
 *
 * @class "v0.Auth"
 *
 * @example
 * const Auth = require('@tillhub/node-sdk').v0.Auth
 * const auth = new Auth ()
 *
 * auth.loginUsername('user@example.com', '123455', (err, body) => {
 *   if (err) throw err
 *   console.log(body.token)
 *   console.log(body.user.id)
 *   console.log(body.user.legacy_id)
 * })
 */
class Auth extends EventEmitter {
  constructor (options = {}) {
    super()
    this.options = {
      credentials: {},
      base: process.env.TILLHUB_BASE || 'https://api.tillhub.com',
      ...options
    }
  }

  authenticate (callback) {
    if (this.options.credentials.username && this.options.credentials.password) {
      return this.loginUsername(this.options.credentials.username, this.options.credentials.password, callback)
    }

    return callback(errors.generate(errors.constants.INSUFFICIENT_CREDENTIALS))
  }

  /**
   *
   * @param {String} username the tillhub client account e-mail address
   * @param {String} password the password corresponding to the tillhub client account
   */
  loginUsername (username, password, callback) {
    const opts = {
      retries: 3
    }

    const requestOptions = {
      uri: '/api/v0/users/login',
      baseUrl: this.options.base,
      method: 'POST',
      json: true,
      body: {
        email: username,
        password
      }
    }

    request(requestOptions, opts, (err, resp, body) => {
      if (err) return callback(err)

      if (resp.statusCode === 200) {
        this.token = body.token
        this.user = body.user.legacy_id || body.user.id

        return callback(null, { token: this.token, user: this.user })
      }

      return callback(new Error('tillhub: could not get user login info'), body, resp)
    })
  }
}

module.exports = {
  Auth
}
