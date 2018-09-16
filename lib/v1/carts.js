const EventEmitter = require('events')
const typeOf = require('just-typeof')
const safeSet = require('just-safe-set')

/**
 * Handle Tillhub Carts from the v1 Model
 *
 * @class
 *
 * @example
 * // create a cart from existing products in order to sell them on the POS clients
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
 * const carts = th.carts()
 *
 * const { data, metadata } = await carts.create({
 *   items: [
 *     {
 *       product: '880ddc0c-7351-45de-99ba-d42541d64fc2',
 *       qty: 1,
 *       currency: 'EUR'
 *     }
 *   ]
 * })
 * console.log(data)
 * // {
 * //   id: '7c1d5998-b421-4531-8e9d-443ed7f17c22',
 * //   [...]
 * //   items: [
 * //     {
 * //       product: '880ddc0c-7351-45de-99ba-d42541d64fc2',
 * //       qty: 1,
 * //       currency: 'EUR',
 * //       vat_rate: 0.19,
 * //       tax: 'd524e4c5-704c-43a2-ba62-5e6cf275045c',
 * //       account: '3621c565-9002-4392-9274-1da57ea89c25',
 * //       amount: {
 * //         gross: 10.99
 * //       }
 * //       [...]
 * //     }
 * //   ]
 * // }
 *
 * @example
 * // get all the carts
 *
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
 * const carts = th.carts()
 *
 * const { data, metadata } = await carts.getAll()
 * console.log(data) // [...]
 *
 */
class Carts extends EventEmitter {
  constructor (options = {}, http) {
    super()
    this.options = {
      ...options
    }

    this.endpoint = '/api/v1/carts'

    this.http = http
  }

  /**
   * Get all carts from client account.
   *
   * @param {Object|Function} [queryOrCallback] query for carts with allowed paramaters, or specify an optional callback
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
        uri: `${this.endpoint}/${this.options.user}`,
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
        return callback(null, body.results, { count: body.count })
      }

      return callback(new Error('tillhub: could not get carts'), body, resp)
    })
  }

  /**
   * Create a cart to consume in Tillhub Clients.
   *
   * @param {Object} cart the cart body
   * @param {Object|Function} [optionsOrCallback] query for carts with allowed paramaters, or specify an optional callback
   * @param {Function} [callback] optional callback. If not specified, this function returns a promise
   */
  create (cart, optionsOrCallback, callback) {
    if (!callback && typeof optionsOrCallback === 'function') {
      callback = optionsOrCallback
      optionsOrCallback = {}
    }

    if (typeOf(optionsOrCallback) !== 'object') {
      return callback(new TypeError('options must be object'))
    }

    let requestOptions = {
      json: true
    }

    if (!optionsOrCallback.uri) {
      requestOptions = {
        ...requestOptions,
        uri: `${this.endpoint}/${this.options.user}`,
        baseUrl: this.options.base,
        body: cart,
        method: 'POST'
      }
    } else {
      requestOptions = {
        ...requestOptions,
        uri: optionsOrCallback.uri,
        body: cart,
        method: 'POST'
      }
    }

    this.http(requestOptions, (err, resp, body) => {
      if (err) return callback(err)

      if (resp.statusCode === 200 && body.results && body.results[0]) {
        return callback(null, body.results[0], { count: body.count, results: body.results })
      } else if (resp.statusCode === 200) {
        return callback(new TypeError('tillhub: have create cart but did ot return valid object'))
      }

      return callback(new Error('tillhub: could not create cart'), body, resp)
    })
  }
}

module.exports = {
  Carts
}
