const EventEmitter = require('events')

class Tillhub extends EventEmitter {
  constructor (options = {}) {
    super()
    this.options = options
  }

  method () {}
}

module.exports = Tillhub
module.exports.v0 = require('./v0')
