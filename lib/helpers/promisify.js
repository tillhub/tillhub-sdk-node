const is = require('is')

// inspired by https://github.com/googleapis/nodejs-common/blob/master/src/util.ts

/**
   * Wraps a callback style function to conditionally return a promise.
   *
   * @param {function} originalMethod - The method to promisify.
   * @param {object=} options - Promise options.
   * @param {boolean} options.singular - Resolve the promise with single arg instead of an array.
   * @return {function} wrapped * @ignore
   * @ignore
   */
function promisify (originalMethod, options) {
  if (originalMethod.promisified_) {
    return originalMethod
  }

  options = options || {}

  const slice = Array.prototype.slice

  // tslint:disable-next-line:no-any
  const wrapper = function (_this) {
    const context = _this
    let last

    for (last = arguments.length - 1; last >= 0; last--) {
      const arg = arguments[last]

      if (is.undefined(arg)) {
        continue // skip trailing undefined.
      }

      if (!is.fn(arg)) {
        break // non-callback last argument found.
      }

      return originalMethod.apply(context, arguments)
    }

    // peel trailing undefined.
    const args = slice.call(arguments, 0, last + 1)

    // tslint:disable-next-line:variable-name
    let PromiseCtor = Promise

    // Because dedupe will likely create a single install of
    // @google-cloud/common to be shared amongst all modules, we need to
    // localize it at the Service level.
    if (context && context.Promise) {
      PromiseCtor = context.Promise
    }

    return new PromiseCtor((resolve, reject) => {
      // tslint:disable-next-line:no-any
      args.push((...args) => {
        const callbackArgs = slice.call(args)
        const err = callbackArgs.shift()

        if (err) {
          return reject(err)
        }

        if (options.singular && callbackArgs.length === 1) {
          resolve(callbackArgs[0])
        } else {
          resolve(callbackArgs)
        }
      })

      originalMethod.apply(context, args)
    })
  }

  wrapper.promisified_ = true
  return wrapper
}

/**
 *
 * @param {Function} Class the class target whose methods will be promisified
 * @param {*} options
 * @ignore
 */
function promisifyAll (Class, options) {
  const exclude = (options && options.exclude) || []
  const methods = Object.keys(Class.prototype).filter((methodName) => {
    // clang-format off
    return (
      is.fn(Class.prototype[methodName]) && // is it a function?
        !/(^_|(Stream|_)|promise$)/.test(methodName) && // is it promisable?
        exclude.indexOf(methodName) === -1
    ) // is it blacklisted?
    // clang-format on
  })

  methods.forEach((methodName) => {
    const originalMethod = Class.prototype[methodName]
    if (!originalMethod.promisified_) {
      Class.prototype[methodName] = promisify(originalMethod, options)
    }
  })
}

module.exports = {
  promisifyAll,
  promisify
}
