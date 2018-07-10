const createError = require('http-errors')

const constants = {
  INSUFFICIENT_CREDENTIALS: {
    code: 422,
    message: 'insufficient credentials'
  }
}

function generate (constant) {
  return createError(constant.code, constant.message)
}

module.exports = {
  generate,
  constants
}
