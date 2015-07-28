/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(6);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	//-- Webpack requires the index.less file for compilation in the main js file.
	//-- On Build it is removed by the extract-text-webpack-plugin.
	//-- So don't worry the css is removed from the deliverable ranger.js.

	__webpack_require__(7);

	//-- The end of the css import

	//-- Create Slider

	var _slider = __webpack_require__(11);

	var _slider2 = _interopRequireDefault(_slider);

	var RANGER = (0, _slider2['default'])();

/***/ },
/* 7 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _utilitiesUtils = __webpack_require__(12);

	var _utilitiesMove = __webpack_require__(13);

	var _utilitiesData = __webpack_require__(14);

	exports['default'] = function () {
	    var sliderNodeList = document.getElementsByClassName('js-ranger');
	    var sliderInputNodeList = document.getElementsByClassName('js-ranger-input');
	    var sliderTrackNodeList = document.getElementsByClassName('js-ranger-track');

	    //-- Prevent the script to be excecuted if the required DOM
	    //-- Implementation is wrong
	    if (sliderNodeList.length <= 0 || sliderInputNodeList.length < sliderNodeList.length || sliderTrackNodeList.length < sliderNodeList.length) {
	        return;
	    }

	    var sliderList = Array.prototype.slice.call(sliderNodeList);
	    var setDebouncedValue = (0, _utilitiesUtils.debounce)(_utilitiesData.setValueInDom, 10);
	    var setDebouncedAttr = (0, _utilitiesUtils.debounce)(_utilitiesData.setAttributeInDom, 40);

	    sliderList.forEach(function (slider, i, array) {
	        var inputEl = slider.querySelector('.js-ranger-input');
	        var trackEl = slider.querySelector('.js-ranger-track');
	        var distanceEl = slider.querySelector('.js-ranger-distance');
	        var valueEl = slider.querySelector('.js-ranger-value');
	        var indicatorEL = slider.querySelector('.js-ranger-indicator');

	        var ranger = {
	            isMoving: false,
	            min: (0, _utilitiesUtils.getNumber)(inputEl, 'data-min'),
	            max: (0, _utilitiesUtils.getNumber)(inputEl, 'data-max'),
	            value: (0, _utilitiesUtils.getNumber)(inputEl, 'value'),
	            steps: (0, _utilitiesUtils.getNumber)(inputEl, 'data-step'),
	            offset: 0,
	            curretValue: 0,
	            dimensions: trackEl.getBoundingClientRect()
	        };

	        var init = function init() {
	            var initialPosition = (0, _utilitiesMove.setInitialPosition)(ranger.min, ranger.max, ranger.value) + '%';

	            distanceEl.style.width = initialPosition;

	            if (indicatorEL !== null) {
	                (0, _utilitiesData.setValueInDom)(valueEl, ranger.value);
	                indicatorEL.style.left = initialPosition;
	            }

	            //-- Set the steps fractions in DOM only if required
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
	            (0, _utilitiesUtils.pauseEvent)(e);
	            ranger.isMoving = true;
	            ranger.animationFrame = requestAnimationFrame(update);

	            //-- Read only calculations responsible for the later
	            //-- positioning of the slider individual components.
	            ranger.offset = e.pageX - ranger.dimensions.left;

	            if (!isNaN(ranger.steps)) {
	                ranger.currentPosition = (0, _utilitiesMove.handlePositionSteps)(ranger.offset, ranger.dimensions.width, ranger.min, ranger.max, ranger.steps);
	            } else {
	                ranger.currentPosition = (0, _utilitiesMove.handlePosition)(ranger.offset, ranger.dimensions.width);
	            }

	            ranger.currentValue = (0, _utilitiesData.handleValue)(ranger.min, ranger.max, ranger.currentPosition);
	        };

	        var onMouseMove = function onMouseMove(e) {
	            if (ranger.isMoving) {
	                (0, _utilitiesUtils.pauseEvent)(e);

	                //-- Read only calculations responsible for the later
	                //-- positioning of the slider individual components.
	                ranger.offset = e.pageX - ranger.dimensions.left;

	                if (!isNaN(ranger.steps)) {
	                    ranger.currentPosition = (0, _utilitiesMove.handlePositionSteps)(ranger.offset, ranger.dimensions.width, ranger.min, ranger.max, ranger.steps);
	                } else {
	                    ranger.currentPosition = (0, _utilitiesMove.handlePosition)(ranger.offset, ranger.dimensions.width);
	                }

	                ranger.currentValue = (0, _utilitiesData.handleValue)(ranger.min, ranger.max, ranger.currentPosition);
	            }
	        };

	        var onMouseUp = function onMouseUp(e) {
	            if (ranger.isMoving) {
	                cancelAnimationFrame(ranger.animationFrame);
	                ranger.isMoving = false;
	                update(null, false);
	            }
	        };

	        //-- Write only function responsible for the updates of the
	        //-- slider components
	        var update = function update(timeStamp) {
	            var loop = arguments[1] === undefined ? true : arguments[1];

	            if (loop) {
	                ranger.animationFrame = requestAnimationFrame(update);
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
	        window.addEventListener('mousemove', (0, _utilitiesUtils.debounce)(onMouseMove, 10));
	        slider.addEventListener('mouseup', onMouseUp);
	    });
	};

	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.getNumber = getNumber;
	exports.pauseEvent = pauseEvent;
	exports.stopPropagation = stopPropagation;
	exports.debounce = debounce;
	exports.requestAnim = requestAnim;

	function getNumber(node, value) {
	    return parseInt(node.getAttribute(value), 10);
	}

	//-- Prevent text selection while dragging

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

	function stopPropagation(e) {
	    if (e.stopPropagation) {
	        e.stopPropagation();
	    }
	    e.cancelBubble = true;
	}

	//-- Returns a function, that, as long as it continues to be invoked, will not
	//-- be triggered. The function will be called after it stops being called for
	//-- N milliseconds. If `immediate` is passed, trigger the function on the
	//-- leading edge, instead of the trailing.
	//-- http://davidwalsh.name/essential-javascript-functions?utm_source=javascriptweekly&utm_medium=email

	function debounce(func, wait, immediate) {
	    var timeout = undefined;
	    return function () {

	        var context = this;
	        var args = arguments;

	        var later = function later() {
	            timeout = null;
	            if (!immediate) {
	                func.apply(context, args);
	            }
	        };

	        var callNow = immediate && !timeout;
	        clearTimeout(timeout);

	        timeout = setTimeout(later, wait);

	        if (callNow) {
	            func.apply(context, args);
	        }
	    };
	}

	;

	//-- requestAnimationFrame polyfill
	//-- https://gist.github.com/paulirish/1579671

	function requestAnim() {
	    var lastTime = 0;
	    var vendors = ['ms', 'moz', 'webkit', 'o'];
	    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	    }

	    if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
	        var currTime = new Date().getTime();
	        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	        var id = window.setTimeout(function () {
	            callback(currTime + timeToCall);
	        }, timeToCall);
	        lastTime = currTime + timeToCall;
	        return id;
	    };

	    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
	        clearTimeout(id);
	    };
	}

	requestAnim();

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.setInitialPosition = setInitialPosition;
	exports.handlePosition = handlePosition;
	exports.handlePositionSteps = handlePositionSteps;

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

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.handleValue = handleValue;
	exports.setValueInDom = setValueInDom;
	exports.setAttributeInDom = setAttributeInDom;

	function handleValue(min, max, percentage) {
	    var maxRange = max - min;
	    return Math.round(percentage * maxRange / 100 + min);
	}

	function setValueInDom(el, value) {
	    return el.textContent = value;
	}

	function setAttributeInDom(el, attr, value) {
	    return el.setAttribute(attr, value);
	}

/***/ }
/******/ ]);