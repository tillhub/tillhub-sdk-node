const EventEmitter = require('events')

/**
 * Handle Tillhub Transactions from the v0 Model
 *
 * @class
 *
 * @example
 * const Tillhub = require('@tillhub/node-sdk')
 * const th = new Tillhub({
 *   credentials: {
 *     username: 'user@example.com',
 *     password: '123455'
 *   }
 * })
 *
 * await th.init()
 * const transactions = th.transactions()
 *
 * const { data, metadata } = await transactions.getAll()
 * console.log(data) // [...]
 *
 */
class Transactions extends EventEmitter {
  constructor (options = {}, http) {
    super()
    this.options = {
      ...options
    }

    this.endpoint = '/api/v0/transactions'

    this.http = http
  }

  /**
   * Get all transactions from client account.
   *
   * @param {Object|Function} [queryOrCallback] query for transactions with allowed paramaters, or specify an optional callback
   * @param {Function} [callback] optional callback. If not specified, this function returns a promise
   */
  getAll (queryOrCallback, callback) {
    if (!callback && typeof queryOrCallback === 'function') callback = queryOrCallback

    const requestOptions = {
      uri: `${this.endpoint}/${this.options.user}/legacy`,
      baseUrl: this.options.base,
      method: 'GET',
      json: true
    }

    this.http(requestOptions, (err, resp, body) => {
      if (err) return callback(err)

      if (resp.statusCode === 200) {
        return callback(null, body.results, { count: body.count })
      }

      return callback(new Error('tillhub: could not get transactions'), body, resp)
    })
  }
}

module.exports = {
  Transactions
}
