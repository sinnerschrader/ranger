(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define('ranger', factory) :
  factory();
}(this, function () { 'use strict';

  function getNumber (node, value) {
    return parseInt(node.getAttribute(value), 10)
  }

  // -- Prevent text selection while dragging
  function pauseEvent (e) {
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

  let now = function now () {
              return new Date().getTime()
            }

  function debounce (func, wait, immediate) {
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

  function setInitialPosition (min, max, initValue) {
    let initial = isNaN(initValue) ? 0 : initValue
    let range = (max - min)
    let percent = Math.round(((initial - min) * 100) / range)
    return percent
  }

  function handlePosition (offset, width) {
    let min = 0
    let max = 100
    let ratio = Math.min(Math.max(offset / width, min), 1)
    let range = (max - min)
    let percent = Math.round((ratio * range) + min)
    return percent
  }

  function handlePositionSteps (offset, width, min, max, stepWidth) {
    let ratio = Math.min(Math.max(offset / width, 0), 1)
    let range = (max - min)
    let currentStep = Math.round((ratio * range) / stepWidth)
    let percent = ((currentStep * stepWidth) / range) * 100
    return percent
  }

  function handleValue (min, max, percentage) {
    let maxRange = max - min
    return Math.round(((percentage * maxRange) / 100) + min)
  }

  function setValueInDom (el, value) {
    el.textContent = value
  }

  function setAttributeInDom (el, attr, value) {
    return el.setAttribute(attr, value)
  }

  function createSlider () {
    let sliderNodeList = document.getElementsByClassName('js-ranger')
    let sliderInputNodeList = document.getElementsByClassName('js-ranger-input')
    let sliderTrackNodeList = document.getElementsByClassName('js-ranger-track')

    // -- Prevent the script to be excecuted if the required DOM
    // -- Implementation is wrong
    if (
      sliderNodeList.length <= 0 ||
      sliderInputNodeList.length < sliderNodeList.length ||
      sliderTrackNodeList.length < sliderNodeList.length) {
      return
    }

    let sliderList = Array.prototype.slice.call(sliderNodeList)
    let setDebouncedValue = debounce(setValueInDom, 10)
    let setDebouncedAttr = debounce(setAttributeInDom, 40)

    sliderList.forEach((slider, i, array) => {
      let inputEl = slider.querySelector('.js-ranger-input')
      let trackEl = slider.querySelector('.js-ranger-track')
      let distanceEl = slider.querySelector('.js-ranger-distance')
      let valueEl = slider.querySelector('.js-ranger-value')
      let indicatorEL = slider.querySelector('.js-ranger-indicator')

      let ranger = {
        isMoving: false,
        min: getNumber(inputEl, 'data-min'),
        max: getNumber(inputEl, 'data-max'),
        value: getNumber(inputEl, 'value'),
        steps: getNumber(inputEl, 'data-step'),
        offset: 0,
        curretValue: 0,
        dimensions: trackEl.getBoundingClientRect()
      }

      let init = () => {
        let initialPosition = setInitialPosition(ranger.min, ranger.max, ranger.value) + '%'

        distanceEl.style.width = initialPosition

        if (indicatorEL !== null) {
          setValueInDom(valueEl, ranger.value)
          indicatorEL.style.left = initialPosition
        }

        // -- Set the steps fractions in DOM only if required
        if (!isNaN(ranger.steps)) {
          let sliderFractionsEl = document.createElement('div')
          let fractionCount = (ranger.max - ranger.min) / ranger.steps
          let fractionDistance = (100 / fractionCount)
          let i

          sliderFractionsEl.classList.add('Slider-steps')
          slider.appendChild(sliderFractionsEl)

          for (i = fractionCount - 1; i >= 1; i--) {
            let fraction = document.createElement('span')
            fraction.classList.add('Slider-fraction')

            fraction.style.left = (fractionDistance * i) + '%'
            sliderFractionsEl.appendChild(fraction)
          }
        }

        window.addEventListener('resize', () => {
          ranger.dimensions = trackEl.getBoundingClientRect()
        })
      }

      init()

      let onMouseDown = e => {
        pauseEvent(e)
        ranger.isMoving = true
        ranger.animationFrame = window.requestAnimationFrame(update)

        // -- Read only calculations responsible for the later
        // -- positioning of the slider individual components.
        ranger.offset = e.pageX - ranger.dimensions.left

        if (!isNaN(ranger.steps)) {
          ranger.currentPosition = handlePositionSteps(ranger.offset, ranger.dimensions.width, ranger.min, ranger.max, ranger.steps)
        } else {
          ranger.currentPosition = handlePosition(ranger.offset, ranger.dimensions.width)
        }

        ranger.currentValue = handleValue(ranger.min, ranger.max, ranger.currentPosition)
      }

      let onMouseMove = e => {
        if (ranger.isMoving) {
          pauseEvent(e)

          // -- Read only calculations responsible for the later
          // -- positioning of the slider individual components.
          ranger.offset = e.pageX - ranger.dimensions.left

          if (!isNaN(ranger.steps)) {
            ranger.currentPosition = handlePositionSteps(ranger.offset, ranger.dimensions.width, ranger.min, ranger.max, ranger.steps)
          } else {
            ranger.currentPosition = handlePosition(ranger.offset, ranger.dimensions.width)
          }

          ranger.currentValue = handleValue(ranger.min, ranger.max, ranger.currentPosition)
        }
      }

      let onMouseUp = e => {
        if (ranger.isMoving) {
          window.cancelAnimationFrame(ranger.animationFrame)
          ranger.isMoving = false
          update(null, false)
        }
      }

      // -- Write only function responsible for the updates of the
      // -- slider components
      let update = (timeStamp, loop = true) => {
        if (loop) {
          ranger.animationFrame = window.requestAnimationFrame(update)
        }

        slider.classList.toggle('is-moving', ranger.isMoving)
        distanceEl.style.width = ranger.currentPosition + '%'
        setDebouncedAttr(inputEl, 'value', ranger.currentValue)

        if (indicatorEL !== null) {
          setDebouncedValue(valueEl, ranger.currentValue)
          indicatorEL.style.left = ranger.currentPosition + '%'
        }
      }

      slider.addEventListener('mousedown', onMouseDown)
      window.addEventListener('mousemove', debounce(onMouseMove, 10))
      window.addEventListener('mouseup', onMouseUp)
    })
  }

  createSlider()

}));
//# sourceMappingURL=bundle.js.map