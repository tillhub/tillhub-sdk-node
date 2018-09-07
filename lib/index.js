const EventEmitter = require('events')
const request = require('request')
const errors = require('./errors')

const { Auth } = require('./v1/auth')
const { Transactions } = require('./v0/transactions')
const { Products } = require('./v1/products')
const { Carts } = require('./v1/carts')

/**
 * Tillhub SDK instance. The instance handles auth autonomously.
 *
 * @class
 *
 * @example
 * const Tillhub = require('@tillhub/node-sdk')
 *
 * const th = new Tillhub({
 *   credentials: {
 *     username: 'user@example.com',
 *     password: '123455'
 *   }
 * })
 *
 * await th.init()
 *
 * // do something with the instance
 * const transactions = th.transactions()
 *
 * const { data, metadata } = await transactions.getAll()
 * console.log(data) // [...]
 *
 */
class Tillhub extends EventEmitter {
  constructor (options = {}) {
    super()
    this.options = {
      base: process.env.TILLHUB_BASE || 'https://api.tillhub.com',
      ...options
    }

    this.auth = null
    this.http = null
  }

  /**
   * Initialise the SDK instance by authenticating the client
   *
   * @param {Function?} callback optional callback. I fnot specified a Promise will be returned
   */
  init (callback) {
    if (!this.options.credentials) {
      return callback(errors.generate(errors.constants.INSUFFICIENT_CREDENTIALS))
    }

    this.auth = new Auth({ credentials: this.options.credentials })

    this.auth.authenticate((err, authResponse) => {
      if (err) return callback(err)

      this.user = authResponse.user

      this.http = request.defaults({
        'Authorization': `Bearer ${authResponse.token}`,
        'X-Client-ID': authResponse.user
      })

      return callback(null, this, this.auth)
    })
  }

  /**
   * Create an authenticated transactions instance
   *
   * @param {Object} options options object
   */
  transactions (options) {
    if (!this.http) throw errors.generate(errors.constants.UNINSTANTIATED_HTTP_CLIENT)
    return new Transactions({ user: this.user, base: this.options.base, ...options }, this.http)
  }

  /**
   * Create an authenticated products instance
   *
   * @param {Object} options options object
   */
  products (options) {
    if (!this.http) throw errors.generate(errors.constants.UNINSTANTIATED_HTTP_CLIENT)
    return new Products({ user: this.user, base: this.options.base, ...options }, this.http)
  }

  /**
   * Create an authenticated carts instance
   *
   * @param {Object} options options object
   * @return {Cart} cart instance
   */
  carts (options) {
    if (!this.http) throw errors.generate(errors.constants.UNINSTANTIATED_HTTP_CLIENT)
    return new Carts({ user: this.user, base: this.options.base, ...options }, this.http)
  }
}

module.exports = Tillhub
module.exports.Tillhub = Tillhub
module.exports.v0 = require('./v0')
module.exports.v1 = require('./v1')
