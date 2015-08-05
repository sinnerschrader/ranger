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
