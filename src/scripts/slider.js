import {getNumber, pauseEvent, debounce} from './utilities/utils'
import {handlePosition, handlePositionSteps, setInitialPosition, eventHandler} from './utilities/move'
import {handleValue, setValueInDom, setAttributeInDom} from './utilities/data'

export default function () {
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
      eventHandler(ranger, pauseEvent, e, true, update)

      if (!isNaN(ranger.steps)) {
        ranger.currentPosition = handlePositionSteps(ranger.offset, ranger.dimensions.width, ranger.min, ranger.max, ranger.steps)
      } else {
        ranger.currentPosition = handlePosition(ranger.offset, ranger.dimensions.width)
      }

      ranger.currentValue = handleValue(ranger.min, ranger.max, ranger.currentPosition)
    }

    let onMouseMove = e => {
      if (ranger.isMoving) {
        eventHandler(ranger, pauseEvent, e, true, update)

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

    let onTouchstart = e => {
      eventHandler(ranger, pauseEvent, e, true, update)

      if (!isNaN(ranger.steps)) {
        ranger.currentPosition = handlePositionSteps(ranger.offset, ranger.dimensions.width, ranger.min, ranger.max, ranger.steps)
      } else {
        ranger.currentPosition = handlePosition(ranger.offset, ranger.dimensions.width)
      }

      ranger.currentValue = handleValue(ranger.min, ranger.max, ranger.currentPosition)
    }

    let onTouchmove = e => {
      if (ranger.isMoving) {
        eventHandler(ranger, pauseEvent, e, true, update)

        if (!isNaN(ranger.steps)) {
          ranger.currentPosition = handlePositionSteps(ranger.offset, ranger.dimensions.width, ranger.min, ranger.max, ranger.steps)
        } else {
          ranger.currentPosition = handlePosition(ranger.offset, ranger.dimensions.width)
        }

        ranger.currentValue = handleValue(ranger.min, ranger.max, ranger.currentPosition)
      }
    }

    let onTouchend = e => {
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

    if ('ontouchstart' in window) {
      slider.addEventListener('touchstart', onTouchstart)
      slider.addEventListener('touchmove', onTouchmove)
      slider.addEventListener('touchend', onTouchend)
    }
  })
}
