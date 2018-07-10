const EventEmitter = require('events')
const errors = require('./errors')

const { Auth } = require('./v0/auth')

class Tillhub extends EventEmitter {
  constructor (options = {}) {
    super()
    this.options = {
      ...options
    }

    this.auth = null
  }

  init (callback) {
    if (!this.options.credentials) {
      return callback(errors.generate(errors.constants.INSUFFICIENT_CREDENTIALS))
    }

    this.auth = new Auth({ credentials: this.options.credentials })

    this.auth.authenticate((err, authResponse) => {
      if (err) return callback(err)

      this.user = authResponse.user

      return callback(null, this, this.auth)
    })
  }
}

module.exports = Tillhub
module.exports.Tillhub = Tillhub
module.exports.v0 = require('./v0')
