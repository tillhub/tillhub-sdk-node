const createError = require('http-errors')

const constants = {
  INSUFFICIENT_CREDENTIALS: {
    code: 422,
    message: 'insufficient credentials'
  },
  UNINSTANTIATED_HTTP_CLIENT: {
    code: 400,
    message: 'cannot instantiate API without instantiated HTTP client'
  },
  CONFLICT_OBJECTS: {
    code: 409,
    message: 'could not generate JSON patch'
  }
}

function generate (constant) {
  return createError(constant.code, constant.message)
}

module.exports = {
  generate,
  constants
}
