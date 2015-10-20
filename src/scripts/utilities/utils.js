export function getNumber (node, value) {
  return parseInt(node.getAttribute(value), 10)
}

// -- Prevent text selection while dragging
export function pauseEvent (e) {
  if (e.stopPropagation) {
    e.stopPropagation()
  }

  if (e.preventDefault) {
    e.preventDefault()
  }

  e.cancelBubble = true
  e.returnValue = false
  return false
}

export function stopPropagation (e) {
  if (e.stopPropagation) {
    e.stopPropagation()
  }

  e.cancelBubble = true
}


let now = function now () {
            return new Date().getTime()
          }

export function debounce (func, wait, immediate) {
  let timeout, args, context, timestamp, result
  if (null == wait) wait = 100

  function later() {
    var last = now() - timestamp

    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  };

  return function debounced () {
    context = this
    args = arguments
    timestamp = now()
    var callNow = immediate && !timeout
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}
