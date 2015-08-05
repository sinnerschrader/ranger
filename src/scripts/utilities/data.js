export function handleValue (min, max, percentage) {
  let maxRange = max - min
  return Math.round(((percentage * maxRange) / 100) + min)
}

export function setValueInDom (el, value) {
  el.textContent = value
}

export function setAttributeInDom (el, attr, value) {
  return el.setAttribute(attr, value)
}
