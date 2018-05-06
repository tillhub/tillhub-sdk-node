const EventEmitter = require('events')
const request = require('retry-request')

/**
 * Authenticate an app via different auth strategies
 *
 * @class
 *
 * @example
 * const Auth = require('@tillhub/node-sdk')
 * const auth = new Auth ()
 *
 * pubsub.loginUsername('user@example.com', '123455', (err, body) => {
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
      base: 'https://staging-api.tillhub.com',
      ...options
    }
  }

  login () {}

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

    request(requestOptions, opts, function (err, resp, body) {
      if (err) return callback(err)

      if (resp.statusCode === 200) {
        return callback(null, body, resp)
      }

      return callback(new Error('tillhub: could not get user login info'), body, resp)
    })
  }

  /**
   * Authenticate as headless service account.
   *
   * @param {String} account tillhub client account uuid
   * @param {String} serviceAccount name of service account (a type of user in the registered in the client account)
   * @param {String} token token string
   */
  loginServiceAccount (account, serviceAccount, token, callback) {

  }
}

module.exports = {
  Auth
}
