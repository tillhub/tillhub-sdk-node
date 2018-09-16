const EventEmitter = require('events')
const typeOf = require('just-typeof')
const safeSet = require('just-safe-set')

/**
 * Handle Tillhub Voucher Logs.
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
 * const vouchers = th.vouchers()
 *
 * const { data, metadata } = await vouchers.logs.getAll()
 * console.log(data) // [...]
 *
 */
class VoucherLogs extends EventEmitter {
  constructor (options = {}, http) {
    super()
    this.options = {
      ...options
    }

    this.endpoint = '/api/v0/vouchers'

    this.http = http
  }

  /**
   * Get all voucher logs for a client account.
   *
   * @param {Object|Function} [queryOrCallback] query for voucher logs with allowed paramaters, or specify an optional callback
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
        uri: `${this.endpoint}/${this.options.user}/logs`,
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

      return callback(new Error('tillhub: could not get voucher logs'), body, resp)
    })
  }
}

/**
 * Handle Tillhub Vouchers.
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
 * const vouchers = th.vouchers()
 *
 * const { data, metadata } = await vouchers.getAll()
 * console.log(data) // [...]
 *
 */
class Vouchers extends EventEmitter {
  constructor (options = {}, http) {
    super()
    this.options = {
      ...options
    }

    this.endpoint = '/api/v0/vouchers'

    this.http = http

    this.logs = new VoucherLogs(options, this.http)
  }

  /**
   * Create a voucher.
   *
   * @param {Object} body object defining a voucher
   * @param {Object|Function} [optionsOrCallback] options for voucher with allowed paramaters, or specify an optional callback
   * @param {Function} [callback] optional callback. If not specified, this function returns a promise
   */
  create (body, optionsOrCallback, callback) {
    if (typeOf(body) !== 'object') {
      return callback(new TypeError('tillhub: body parameter must be object'))
    }

    if (!body.format || !body.format_type) {
      return callback(new Error('tillhub: body requires valid format and format_type'))
    }

    if (!callback && typeof optionsOrCallback === 'function') {
      callback = optionsOrCallback
      optionsOrCallback = {}
    }

    if (typeOf(optionsOrCallback) !== 'object') {
      return callback(new TypeError('tillhub: query parameter must be object'))
    }

    let requestOptions = {
      json: true,
      body
    }

    // user, but more often this function itself can override the URI
    // property. This will be used for paging out and providing a callable function,
    // later on
    if (!optionsOrCallback.uri) {
      requestOptions = {
        ...requestOptions,
        uri: `${this.endpoint}/${this.options.user}`,
        baseUrl: this.options.base,
        method: 'POST'
      }
    } else {
      requestOptions = {
        ...requestOptions,
        uri: optionsOrCallback.uri,
        method: 'POST'
      }
    }

    this.http(requestOptions, (err, resp, body) => {
      if (err) {
        err.body = body
        return callback(err)
      }

      if (resp.statusCode === 200) {
        return callback(null, body.results, { count: body.count, cursor: body.cursor })
      }

      return callback(new Error('tillhub: could not create voucher'), body, resp)
    })
  }

  /**
   * Replace propertise on a voucher.
   *
   * @param {Object} body object defining voucher properties
   * @param {Object|Function} [optionsOrCallback] options for vouchers with allowed paramaters, or specify an optional callback
   * @param {Function} [callback] optional callback. If not specified, this function returns a promise
   */
  put (body, optionsOrCallback, callback) {
    if (typeOf(body) !== 'object') {
      return callback(new TypeError('tillhub: body parameter must be object'))
    }

    if (!callback && typeof optionsOrCallback === 'function') {
      callback = optionsOrCallback
      optionsOrCallback = {}
    }

    if (typeOf(optionsOrCallback) !== 'object') {
      return callback(new TypeError('query parameter must be object'))
    }

    let requestOptions = {
      json: true,
      body
    }

    // user, but more often this function itself can override the URI
    // property. This will be used for paging out and providing a callable function,
    // later on
    if (!optionsOrCallback.uri) {
      requestOptions = {
        ...requestOptions,
        uri: `${this.endpoint}/${this.options.user}`,
        baseUrl: this.options.base,
        method: 'PUT'
      }
    } else {
      requestOptions = {
        ...requestOptions,
        uri: optionsOrCallback.uri,
        method: 'PUT'
      }
    }

    this.http(requestOptions, (err, resp, body) => {
      if (err) {
        err.body = body
        return callback(err)
      }

      if (resp.statusCode === 200) {
        return callback(null, body.results, { count: body.count, cursor: body.cursor })
      }

      return callback(new Error('tillhub: could not put voucher'), body, resp)
    })
  }

  /**
   * Get all vouchers from client account.
   *
   * @param {Object|Function} [queryOrCallback] query for vouchers with allowed paramaters, or specify an optional callback
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
      if (err) {
        err.body = body
        return callback(err)
      }

      if (resp.statusCode === 200) {
        return callback(null, body.results, { count: body.count, cursor: body.cursor })
      }

      return callback(new Error('tillhub: could not get vouchers'), body, resp)
    })
  }
}

module.exports = {
  Vouchers,
  VoucherLogs
}
