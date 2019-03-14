
function throttle (func, wait = 100, options = {}) {
  let context
  let result
  let timeout = null
  let previous = 0

  return function Callback (...args) {
    const now = Date.now()
    if (!previous && options.leading === false) {
      previous = now
    }

    const remaining = wait - (now - previous)
    context = this // eslint-disable-line
    if (remaining <= 0) {
      clearTimeout(timeout)
      timeout = null
      previous = now
      result = func.apply(context, args)
      args = null
      context = null
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(() => {
        previous = options.leading === false ? 0 : Date.now()
        timeout = null
        result = func.apply(context, args)
        args = null
        context = null
      }, remaining)
    }
    return result
  }
}
