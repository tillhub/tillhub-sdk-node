const request = require('retry-request')

const { Auth: AuthV0 } = require('../v0/auth')

const errors = require('../errors')

/**
 * Authenticate an app via different auth strategies
 *
 * @class
 * @extends "v0.Auth"
 *
 * @example
 * const Auth = require('@tillhub/node-sdk').v1.Auth
 * const auth = new Auth ()
 *
 * pubsub.loginServiceAccount('user@example.com', '123455', (err, body) => {
 *   if (err) throw err
 *   console.log(body.token)
 *   console.log(body.user.id)
 *   console.log(body.user.legacy_id)
 * })
 */
class Auth extends AuthV0 {
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

    if (this.options.credentials.id && this.options.credentials.apiKey) {
      return this.loginServiceAccount(this.options.credentials.id, this.options.credentials.apiKey, callback)
    }

    return callback(errors.generate(errors.constants.INSUFFICIENT_CREDENTIALS))
  }

  /**
   * Authenticate as headless service account.
   *
   * @param {String} clientAccount tillhub client account uuid
   * @param {String} apiKey name of service account (a type of user in the registered in the client account)
   */
  loginServiceAccount (clientAccount, apiKey, callback) {
    const requestOptions = {
      uri: '/api/v1/users/auth/key',
      baseUrl: this.options.base,
      method: 'POST',
      json: true,
      body: {
        id: clientAccount,
        api_key: apiKey
      }
    }

    request(requestOptions, (err, resp, body) => {
      if (err) return callback(err)

      if (resp.statusCode === 200) {
        this.token = body.token
        this.user = body.user.legacy_id || body.user.id

        return callback(null, { token: this.token, user: this.user })
      }

      return callback(new Error('tillhub: could not get serviceaccount login info'), body, resp)
    })
  }
}

module.exports = {
  Auth
}