const EventEmitter = require('events')
const typeOf = require('just-typeof')

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
 * const config = th.Configurations()
 *
 * const { data } = await config.Patch(
 *  { objectOne: "value1" },
 *  { objectTwo: "value2" }
 * )
 *
 * console.log(data) // [...]
 *
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
   * Differentiate configuration patch
   *
   */
  patch (queryOrCallback, callback) {
    if (typeOf(queryOrCallback) !== 'object') {
      return callback(new TypeError('query parameter must be object'))
    }

    if (!queryOrCallback.objectOne || !queryOrCallback.objectTwo) {
      return callback(new TypeError('data to diff must be object'))
    }

    let requestOptions = {
      json: true,
      method: 'PATCH',
      body: {
        objectOne: queryOrCallback.objectOne,
        objectTwo: queryOrCallback.objectTwo
      }
    }

    if (!queryOrCallback.uri) {
      requestOptions = {
        ...requestOptions,
        uri: this.endpoint,
        baseUrl: this.options.base
      }
    } else {
      requestOptions = {
        ...requestOptions,
        uri: queryOrCallback.uri
      }
    }

    this.http(requestOptions, (err, resp, body) => {
      if (err) return callback(err)

      if (resp.statusCode === 200) {
        let next = null

        return callback(null, body.results, next)
      }

      return callback(new Error('tillhub: could not get configuration patch'), body, resp)
    })
  }
}

module.exports = {
  Configurations
}
