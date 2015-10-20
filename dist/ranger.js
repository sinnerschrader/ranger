'use strict';

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() : typeof define === 'function' && define.amd ? define('ranger', factory) : factory();
})(undefined, function () {
  'use strict';

  function getNumber(node, value) {
    return parseInt(node.getAttribute(value), 10);
  }

  // -- Prevent text selection while dragging
  function pauseEvent(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    if (e.preventDefault) {
      e.preventDefault();
    }

    e.cancelBubble = true;
    e.returnValue = false;
    return false;
  }

  var now = function now() {
    return new Date().getTime();
  };

  function debounce(func, wait, immediate) {
    var timeout = undefined,
        args = undefined,
        context = undefined,
        timestamp = undefined,
        result = undefined;
    if (null == wait) wait = 100;

    function later() {
      var last = now() - timestamp;

      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function debounced() {
      context = this;
      args = arguments;
      timestamp = now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  }

  function setInitialPosition(min, max, initValue) {
    var initial = isNaN(initValue) ? 0 : initValue;
    var range = max - min;
    var percent = Math.round((initial - min) * 100 / range);
    return percent;
  }

  function handlePosition(offset, width) {
    var min = 0;
    var max = 100;
    var ratio = Math.min(Math.max(offset / width, min), 1);
    var range = max - min;
    var percent = Math.round(ratio * range + min);
    return percent;
  }

  function handlePositionSteps(offset, width, min, max, stepWidth) {
    var ratio = Math.min(Math.max(offset / width, 0), 1);
    var range = max - min;
    var currentStep = Math.round(ratio * range / stepWidth);
    var percent = currentStep * stepWidth / range * 100;
    return percent;
  }

  function handleValue(min, max, percentage) {
    var maxRange = max - min;
    return Math.round(percentage * maxRange / 100 + min);
  }

  function setValueInDom(el, value) {
    el.textContent = value;
  }

  function setAttributeInDom(el, attr, value) {
    return el.setAttribute(attr, value);
  }

  function createSlider() {
    var sliderNodeList = document.getElementsByClassName('js-ranger');
    var sliderInputNodeList = document.getElementsByClassName('js-ranger-input');
    var sliderTrackNodeList = document.getElementsByClassName('js-ranger-track');

    // -- Prevent the script to be excecuted if the required DOM
    // -- Implementation is wrong
    if (sliderNodeList.length <= 0 || sliderInputNodeList.length < sliderNodeList.length || sliderTrackNodeList.length < sliderNodeList.length) {
      return;
    }

    var sliderList = Array.prototype.slice.call(sliderNodeList);
    var setDebouncedValue = debounce(setValueInDom, 10);
    var setDebouncedAttr = debounce(setAttributeInDom, 40);

    sliderList.forEach(function (slider, i, array) {
      var inputEl = slider.querySelector('.js-ranger-input');
      var trackEl = slider.querySelector('.js-ranger-track');
      var distanceEl = slider.querySelector('.js-ranger-distance');
      var valueEl = slider.querySelector('.js-ranger-value');
      var indicatorEL = slider.querySelector('.js-ranger-indicator');

      var ranger = {
        isMoving: false,
        min: getNumber(inputEl, 'data-min'),
        max: getNumber(inputEl, 'data-max'),
        value: getNumber(inputEl, 'value'),
        steps: getNumber(inputEl, 'data-step'),
        offset: 0,
        curretValue: 0,
        dimensions: trackEl.getBoundingClientRect()
      };

      var init = function init() {
        var initialPosition = setInitialPosition(ranger.min, ranger.max, ranger.value) + '%';

        distanceEl.style.width = initialPosition;

        if (indicatorEL !== null) {
          setValueInDom(valueEl, ranger.value);
          indicatorEL.style.left = initialPosition;
        }

        // -- Set the steps fractions in DOM only if required
        if (!isNaN(ranger.steps)) {
          var sliderFractionsEl = document.createElement('div');
          var fractionCount = (ranger.max - ranger.min) / ranger.steps;
          var fractionDistance = 100 / fractionCount;
          var _i = undefined;

          sliderFractionsEl.classList.add('Slider-steps');
          slider.appendChild(sliderFractionsEl);

          for (_i = fractionCount - 1; _i >= 1; _i--) {
            var fraction = document.createElement('span');
            fraction.classList.add('Slider-fraction');

            fraction.style.left = fractionDistance * _i + '%';
            sliderFractionsEl.appendChild(fraction);
          }
        }

        window.addEventListener('resize', function () {
          ranger.dimensions = trackEl.getBoundingClientRect();
        });
      };

      init();

      var onMouseDown = function onMouseDown(e) {
        pauseEvent(e);
        ranger.isMoving = true;
        ranger.animationFrame = window.requestAnimationFrame(update);

        // -- Read only calculations responsible for the later
        // -- positioning of the slider individual components.
        ranger.offset = e.pageX - ranger.dimensions.left;

        if (!isNaN(ranger.steps)) {
          ranger.currentPosition = handlePositionSteps(ranger.offset, ranger.dimensions.width, ranger.min, ranger.max, ranger.steps);
        } else {
          ranger.currentPosition = handlePosition(ranger.offset, ranger.dimensions.width);
        }

        ranger.currentValue = handleValue(ranger.min, ranger.max, ranger.currentPosition);
      };

      var onMouseMove = function onMouseMove(e) {
        if (ranger.isMoving) {
          pauseEvent(e);

          // -- Read only calculations responsible for the later
          // -- positioning of the slider individual components.
          ranger.offset = e.pageX - ranger.dimensions.left;

          if (!isNaN(ranger.steps)) {
            ranger.currentPosition = handlePositionSteps(ranger.offset, ranger.dimensions.width, ranger.min, ranger.max, ranger.steps);
          } else {
            ranger.currentPosition = handlePosition(ranger.offset, ranger.dimensions.width);
          }

          ranger.currentValue = handleValue(ranger.min, ranger.max, ranger.currentPosition);
        }
      };

      var onMouseUp = function onMouseUp(e) {
        if (ranger.isMoving) {
          window.cancelAnimationFrame(ranger.animationFrame);
          ranger.isMoving = false;
          update(null, false);
        }
      };

      // -- Write only function responsible for the updates of the
      // -- slider components
      var update = function update(timeStamp) {
        var loop = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

        if (loop) {
          ranger.animationFrame = window.requestAnimationFrame(update);
        }

        slider.classList.toggle('is-moving', ranger.isMoving);
        distanceEl.style.width = ranger.currentPosition + '%';
        setDebouncedAttr(inputEl, 'value', ranger.currentValue);

        if (indicatorEL !== null) {
          setDebouncedValue(valueEl, ranger.currentValue);
          indicatorEL.style.left = ranger.currentPosition + '%';
        }
      };

      slider.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', debounce(onMouseMove, 10));
      window.addEventListener('mouseup', onMouseUp);
    });
  }

  createSlider();
});
//# sourceMappingURL=bundle.js.map