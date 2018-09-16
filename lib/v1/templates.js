const EventEmitter = require('events')
const typeOf = require('just-typeof')

/**
 * Handle Tillhub Templates from the v1 Model.
 *
 * Templates will drive email and document behaviours and layouts.
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
 * const templates = th.templates()
 *
 * const { data, metadata } = await templates.getAll()
 * console.log(data) // [...]
 *
 */
class Templates extends EventEmitter {
  constructor (options = {}, http) {
    super()
    this.options = {
      ...options
    }

    this.endpoint = '/api/v1/templates'

    this.http = http
  }

  /**
   * Create a template.
   *
   * @param {Object} body object defining a template
   * @param {Object|Function} [optionsOrCallback] options for templates with allowed paramaters, or specify an optional callback
   * @param {Function} [callback] optional callback. If not specified, this function returns a promise
   */
  create (body, optionsOrCallback, callback) {
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
      if (err) return callback(err)

      if (resp.statusCode === 200) {
        return callback(null, body.results, { count: body.count, cursor: body.cursor })
      }

      return callback(new Error('tillhub: could not create template'), body, resp)
    })
  }

  /**
   * Replance propertise on a template.
   *
   * @param {Object} body object defining template properties
   * @param {Object|Function} [optionsOrCallback] options for templates with allowed paramaters, or specify an optional callback
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
      if (err) return callback(err)

      if (resp.statusCode === 200) {
        return callback(null, body.results, { count: body.count, cursor: body.cursor })
      }

      return callback(new Error('tillhub: could not put template'), body, resp)
    })
  }

  /**
   * Get all templates from client account.
   *
   * @param {Object|Function} [queryOrCallback] query for templates with allowed paramaters, or specify an optional callback
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
      if (err) return callback(err)

      if (resp.statusCode === 200) {
        return callback(null, body.results, { count: body.count, cursor: body.cursor })
      }

      return callback(new Error('tillhub: could not get templates'), body, resp)
    })
  }
}

module.exports = {
  Templates
}
