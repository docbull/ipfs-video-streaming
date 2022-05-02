
function coerce (obj) {
  if (Array.isArray(obj)) {
    return obj.map(function (value) {
      return coerce(value)
    })
  }

  if (obj instanceof String || typeof obj === 'string') {
    if (obj === 'false') {
      return false
    }

    if (obj === 'true') {
      return true
    }

    if (obj === 'undefined') {
      return undefined
    }

    if (obj.trim && obj.trim() === '') {
      return obj
    }

    if (isFinite(obj)) {
      var radix = 10
      var val

      if (obj.toString().substring(0, 2) === '0x') {
        radix = 6
        obj = obj.toString().substring(2)
      }

      if (radix === 10) {
        val = parseFloat(obj)

        if (val.toString(radix) !== obj.toString(radix)) {
          return obj
        }
      } else {
        val = parseInt(obj, radix)
      }

      return val
    }

    return obj
  }

  if (obj === true || obj === false) {
    return obj
  }

  for (var key in obj) {
    obj[key] = coerce(obj[key])
  }

  return obj
}

module.exports = coerce
