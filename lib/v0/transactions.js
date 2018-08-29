const EventEmitter = require('events')
const typeOf = require('just-typeof')
const safeSet = require('just-safe-set')

/**
 * Handle Tillhub Transactions from the v0 Model
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
   * @param {Object|Function} [queryOrCallback] query for transactions with allowed parameters, or specify an optional callback
   * @param {Function} [callback] optional callback. If not specified, this function returns a promise
   */
  getAll (queryOrCallback, callback) {
    if (!callback && typeof queryOrCallback === 'function') {
      callback = queryOrCallback
      queryOrCallback = {}
    }

    if (typeOf(queryOrCallback) !== 'object') {
      return callback(new TypeError('query parameter must be object'))
    }

    if (queryOrCallback.limit) safeSet(queryOrCallback, 'qs.limit', queryOrCallback.limit)

    let requestOptions = {
      json: true
    }

    // user, but more often this function itself can override the URI
    // property. This will be used for paging out and providing a callable function,
    // later on
    if (!queryOrCallback.uri) {
      requestOptions = {
        ...requestOptions,
        uri: `${this.endpoint}/${this.options.user}/legacy`,
        baseUrl: this.options.base,
        qs: queryOrCallback.qs,
        method: 'GET'
      }
    } else {
      requestOptions = {
        ...requestOptions,
        uri: queryOrCallback.uri,
        method: 'GET'
      }
    }

    this.http(requestOptions, (err, resp, body) => {
      if (err) return callback(err)

      if (resp.statusCode === 200) {
        let next = null

        // handling paging by providing a callable function to caller
        if (body.cursor && body.cursor.next) {
          next = (cb) => {
            this.getAll({ uri: body.cursor.next }, cb)
          }
        }

        return callback(null, body.results, { count: body.count, cursor: body.cursor }, next)
      }

      return callback(new Error('tillhub: could not get transactions'), body, resp)
    })
  }
}

module.exports = {
  Transactions
}
