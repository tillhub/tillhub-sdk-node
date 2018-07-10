const createError = require('http-errors')

const constants = {
  INSUFFICIENT_CREDENTIALS: {
    code: 422,
    message: 'insufficient credentials'
  },
  UNINSTANTIATED_HTTP_CLIENT: {
    code: 400,
    message: 'cannot instantiate API without instantiated HTTP client'
  }
}

function generate (constant) {
  return createError(constant.code, constant.message)
}

module.exports = {
  generate,
  constants
}
