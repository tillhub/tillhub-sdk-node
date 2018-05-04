const EventEmitter = require('events')

class Tillhub extends EventEmitter {
  constructor (options = {}) {
    super()
    this.options = options
  }

  method () {}
}

module.exports = Tillhub
