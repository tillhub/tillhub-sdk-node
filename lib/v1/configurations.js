const EventEmitter = require('events')
const typeOf = require('just-typeof')
const errors = require('../errors')

const { diff, jsonPatchPathConverter } = require('just-diff')

/**
 * Handles configurations from the v1 Model
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
 * const config = th.configurations()
 *
 * const { data, metadata } = await config.patch()
 * console.log(data) // [...]
 */
class Configurations extends EventEmitter {
  constructor (options = {}, http) {
    super()
    this.options = {
      ...options
    }

    this.endpoint = '/api/v1/configurations'
    this.http = http
  }

  /**
   * Update configuration partially
   *
   * @param {originalObject} originalObject target object to modify
   * @param {modifiedObject} modifiedObject expected object after being modified
   * @param {objects|Function} [queryOrCallback] query for configurations with allowed parameters, or specify an optional callback
   * @param {Function} [callback] optional callback. If not specified, this function returns a promise
   */
  patch (originalObject, modifiedObject, queryOrCallback, callback) {
    if (!callback && typeof queryOrCallback === 'function') {
      callback = queryOrCallback
      queryOrCallback = {}
    }

    if (typeOf(queryOrCallback) !== 'object') {
      return callback(new TypeError('Tillhub: query parameter must be object'))
    }

    if (!queryOrCallback.id) {
      return callback(new ReferenceError(`Tillhub: query 'id' must be provided`))
    }

    let patchBody
    try {
      patchBody = diff(originalObject, modifiedObject, jsonPatchPathConverter)
    } catch (e) {
      return callback(errors.generate(errors.constants.CONFLICT_OBJECTS))
    }

    let requestOptions = {
      headers: {
        'content-type': 'application/json-patch+json'
      },
      method: 'PATCH',
      json: true
    }

    if (!queryOrCallback.uri) {
      requestOptions = {
        ...requestOptions,
        uri: `${this.endpoint}/${this.options.user}/${queryOrCallback.id}`,
        baseUrl: this.options.base,
        body: patchBody
      }
    } else {
      requestOptions = {
        ...requestOptions,
        uri: queryOrCallback.uri,
        body: patchBody
      }
    }

    this.http(requestOptions, (err, resp, body) => {
      if (err) return callback(err)

      if (resp.statusCode === 200) {
        return callback(null, body, resp)
      }

      return callback(new Error('Tillhub: could not get configurations patch'), body, resp)
    })
  }
}

module.exports = {
  Configurations
}
