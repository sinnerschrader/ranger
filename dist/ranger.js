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

	module.exports = __webpack_require__(5);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	//-- Webpack requires the index.less file for compilation in the main js file.
	//-- On Build it is removed by the extract-text-webpack-plugin.
	//-- So don't worry the css is removed from the deliverable ranger.js.

	__webpack_require__(6);

	//-- The end of the css import

	//-- Create Slider

	var _slider = __webpack_require__(10);

	var _slider2 = _interopRequireDefault(_slider);

	var RANGER = (0, _slider2['default'])();
	console.log(RANGER);

/***/ },
/* 6 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _lodashDebounce = __webpack_require__(11);

	var _lodashDebounce2 = _interopRequireDefault(_lodashDebounce);

	var _utilitiesUtils = __webpack_require__(13);

	var _utilitiesMove = __webpack_require__(14);

	var _utilitiesData = __webpack_require__(15);

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

	    //-- Debouece helpers
	    var _debouncedSetValueInDom = (0, _lodashDebounce2['default'])(_utilitiesData.setValueInDom, 20);
	    var _debouncedSetAttributeInDom = (0, _lodashDebounce2['default'])(_utilitiesData.setAttributeInDom, 40);

	    //-- Ranger Settings
	    var ranger = {
	        isActive: false,
	        offset: 0,
	        dimensions: 0,
	        clientRectLeft: 0,
	        currentPosition: 0,
	        currentValue: null
	    };

	    sliderList.forEach(function (slider, i, array) {
	        var inputEl = slider.querySelector('.js-ranger-input');
	        var trackEl = slider.querySelector('.js-ranger-track');
	        var distanceEl = slider.querySelector('.js-ranger-distance');
	        var valueEl = slider.querySelector('.js-ranger-value');
	        var indicatorEL = slider.querySelector('.js-ranger-indicator');
	        var minVal = (0, _utilitiesUtils.getMin)(inputEl, 'data-min');
	        var maxVal = (0, _utilitiesUtils.getMax)(inputEl, 'data-max');
	        var value = (0, _utilitiesUtils.getValue)(inputEl, 'value');
	        var steps = (0, _utilitiesUtils.getSteps)(inputEl, 'data-step');
	        ranger.dimensions = trackEl.getBoundingClientRect();
	        ranger.clientRectLeft = ranger.dimensions.left;

	        //-- Initialize the slider
	        var init = function init() {
	            if (indicatorEL !== null) {
	                (0, _utilitiesData.setValueInDom)(valueEl, value);
	            }
	            distanceEl.style.width = (0, _utilitiesMove.setInitialPosition)(minVal, maxVal, value) + '%';
	        };
	        init();

	        var handleMouseDown = function handleMouseDown(e) {
	            (0, _utilitiesUtils.pauseEvent)(e);
	            if (!slider.classList.contains('is-active')) {
	                slider.classList.add('is-active');
	            }

	            //-- Calculates and sets the new position of the slider
	            ranger.offset = e.pageX - ranger.clientRectLeft;
	            ranger.isActive = true;

	            //-- Verify if the slider has steps
	            //-- and set the position accordingly
	            if (!isNaN(steps)) {
	                ranger.currentPosition = (0, _utilitiesMove.handlePositionSteps)(ranger.offset, ranger.dimensions.width, minVal, maxVal, steps);
	            } else {
	                ranger.currentPosition = (0, _utilitiesMove.handlePosition)(ranger.offset, ranger.dimensions.width);
	            }
	            distanceEl.style.width = ranger.currentPosition + '%';

	            //-- Calculates and sets the value of the specific slider
	            ranger.currentValue = (0, _utilitiesData.handleValue)(minVal, maxVal, ranger.currentPosition);

	            (0, _utilitiesData.setAttributeInDom)(inputEl, 'value', ranger.currentValue);

	            if (indicatorEL !== null) {
	                (0, _utilitiesData.setValueInDom)(valueEl, ranger.currentValue);
	            }
	        };

	        slider.addEventListener('mousedown', handleMouseDown);
	        slider.removeEventListener('mousedown', handleMouseDown, true);

	        var handleMouseMove = function handleMouseMove(e) {
	            if (ranger.isActive) {
	                (0, _utilitiesUtils.pauseEvent)(e);

	                //-- Calculates and sets the new position of the slider
	                ranger.offset = e.pageX - ranger.clientRectLeft;
	                if (!isNaN(steps)) {
	                    ranger.currentPosition = (0, _utilitiesMove.handlePositionSteps)(ranger.offset, ranger.dimensions.width, minVal, maxVal, steps);
	                } else {
	                    ranger.currentPosition = (0, _utilitiesMove.handlePosition)(ranger.offset, ranger.dimensions.width);
	                }
	                distanceEl.style.width = ranger.currentPosition + '%';

	                //-- Calculates and sets the value of the specific slider
	                ranger.currentValue = (0, _utilitiesData.handleValue)(minVal, maxVal, ranger.currentPosition);
	                _debouncedSetAttributeInDom(inputEl, 'value', ranger.currentValue);

	                if (indicatorEL !== null) {
	                    _debouncedSetValueInDom(valueEl, ranger.currentValue);
	                }
	            }
	        };

	        slider.addEventListener('mousemove', (0, _lodashDebounce2['default'])(handleMouseMove, 10));
	        slider.removeEventListener('mousemove', handleMouseMove, true);

	        var handleMouseUp = function handleMouseUp(e) {
	            if (ranger.isActive) {
	                if (slider.classList.contains('is-active')) {
	                    slider.classList.remove('is-active');
	                }
	                ranger.isActive = false;
	            }
	        };

	        slider.addEventListener('mouseup', handleMouseUp);
	        slider.removeEventListener('mouseup', handleMouseUp, true);
	    });

	    //-- $todo: the function should retun an object
	    //-- with the values of slider
	    return ranger;
	};

	module.exports = exports['default'];

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.1.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var getNative = __webpack_require__(12);

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max,
	    nativeNow = getNative(Date, 'now');

	/**
	 * Gets the number of milliseconds that have elapsed since the Unix epoch
	 * (1 January 1970 00:00:00 UTC).
	 *
	 * @static
	 * @memberOf _
	 * @category Date
	 * @example
	 *
	 * _.defer(function(stamp) {
	 *   console.log(_.now() - stamp);
	 * }, _.now());
	 * // => logs the number of milliseconds it took for the deferred function to be invoked
	 */
	var now = nativeNow || function() {
	  return new Date().getTime();
	};

	/**
	 * Creates a debounced function that delays invoking `func` until after `wait`
	 * milliseconds have elapsed since the last time the debounced function was
	 * invoked. The debounced function comes with a `cancel` method to cancel
	 * delayed invocations. Provide an options object to indicate that `func`
	 * should be invoked on the leading and/or trailing edge of the `wait` timeout.
	 * Subsequent calls to the debounced function return the result of the last
	 * `func` invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
	 * on the trailing edge of the timeout only if the the debounced function is
	 * invoked more than once during the `wait` timeout.
	 *
	 * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
	 * for details over the differences between `_.debounce` and `_.throttle`.
	 *
	 * @static
	 * @memberOf _
	 * @category Function
	 * @param {Function} func The function to debounce.
	 * @param {number} [wait=0] The number of milliseconds to delay.
	 * @param {Object} [options] The options object.
	 * @param {boolean} [options.leading=false] Specify invoking on the leading
	 *  edge of the timeout.
	 * @param {number} [options.maxWait] The maximum time `func` is allowed to be
	 *  delayed before it is invoked.
	 * @param {boolean} [options.trailing=true] Specify invoking on the trailing
	 *  edge of the timeout.
	 * @returns {Function} Returns the new debounced function.
	 * @example
	 *
	 * // avoid costly calculations while the window size is in flux
	 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
	 *
	 * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
	 * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
	 *   'leading': true,
	 *   'trailing': false
	 * }));
	 *
	 * // ensure `batchLog` is invoked once after 1 second of debounced calls
	 * var source = new EventSource('/stream');
	 * jQuery(source).on('message', _.debounce(batchLog, 250, {
	 *   'maxWait': 1000
	 * }));
	 *
	 * // cancel a debounced call
	 * var todoChanges = _.debounce(batchLog, 1000);
	 * Object.observe(models.todo, todoChanges);
	 *
	 * Object.observe(models, function(changes) {
	 *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
	 *     todoChanges.cancel();
	 *   }
	 * }, ['delete']);
	 *
	 * // ...at some point `models.todo` is changed
	 * models.todo.completed = true;
	 *
	 * // ...before 1 second has passed `models.todo` is deleted
	 * // which cancels the debounced `todoChanges` call
	 * delete models.todo;
	 */
	function debounce(func, wait, options) {
	  var args,
	      maxTimeoutId,
	      result,
	      stamp,
	      thisArg,
	      timeoutId,
	      trailingCall,
	      lastCalled = 0,
	      maxWait = false,
	      trailing = true;

	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  wait = wait < 0 ? 0 : (+wait || 0);
	  if (options === true) {
	    var leading = true;
	    trailing = false;
	  } else if (isObject(options)) {
	    leading = !!options.leading;
	    maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
	    trailing = 'trailing' in options ? !!options.trailing : trailing;
	  }

	  function cancel() {
	    if (timeoutId) {
	      clearTimeout(timeoutId);
	    }
	    if (maxTimeoutId) {
	      clearTimeout(maxTimeoutId);
	    }
	    lastCalled = 0;
	    maxTimeoutId = timeoutId = trailingCall = undefined;
	  }

	  function complete(isCalled, id) {
	    if (id) {
	      clearTimeout(id);
	    }
	    maxTimeoutId = timeoutId = trailingCall = undefined;
	    if (isCalled) {
	      lastCalled = now();
	      result = func.apply(thisArg, args);
	      if (!timeoutId && !maxTimeoutId) {
	        args = thisArg = undefined;
	      }
	    }
	  }

	  function delayed() {
	    var remaining = wait - (now() - stamp);
	    if (remaining <= 0 || remaining > wait) {
	      complete(trailingCall, maxTimeoutId);
	    } else {
	      timeoutId = setTimeout(delayed, remaining);
	    }
	  }

	  function maxDelayed() {
	    complete(trailing, timeoutId);
	  }

	  function debounced() {
	    args = arguments;
	    stamp = now();
	    thisArg = this;
	    trailingCall = trailing && (timeoutId || !leading);

	    if (maxWait === false) {
	      var leadingCall = leading && !timeoutId;
	    } else {
	      if (!maxTimeoutId && !leading) {
	        lastCalled = stamp;
	      }
	      var remaining = maxWait - (stamp - lastCalled),
	          isCalled = remaining <= 0 || remaining > maxWait;

	      if (isCalled) {
	        if (maxTimeoutId) {
	          maxTimeoutId = clearTimeout(maxTimeoutId);
	        }
	        lastCalled = stamp;
	        result = func.apply(thisArg, args);
	      }
	      else if (!maxTimeoutId) {
	        maxTimeoutId = setTimeout(maxDelayed, remaining);
	      }
	    }
	    if (isCalled && timeoutId) {
	      timeoutId = clearTimeout(timeoutId);
	    }
	    else if (!timeoutId && wait !== maxWait) {
	      timeoutId = setTimeout(delayed, wait);
	    }
	    if (leadingCall) {
	      isCalled = true;
	      result = func.apply(thisArg, args);
	    }
	    if (isCalled && !timeoutId && !maxTimeoutId) {
	      args = thisArg = undefined;
	    }
	    return result;
	  }
	  debounced.cancel = cancel;
	  return debounced;
	}

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	module.exports = debounce;


/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * lodash 3.9.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/** `Object#toString` result references. */
	var funcTag = '[object Function]';

	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object == null ? undefined : object[key];
	  return isNative(value) ? value : undefined;
	}

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 equivalents which return 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (isFunction(value)) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}

	module.exports = getNative;


/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.getMin = getMin;
	exports.getMax = getMax;
	exports.getSteps = getSteps;
	exports.getValue = getValue;
	exports.pauseEvent = pauseEvent;
	exports.stopPropagation = stopPropagation;

	function getMin(node, minAttr) {
	    return parseInt(node.getAttribute(minAttr), 10);
	}

	function getMax(node, maxAttr) {
	    return parseInt(node.getAttribute(maxAttr), 10);
	}

	function getSteps(node, stepAttr) {
	    return parseInt(node.getAttribute(stepAttr), 10);
	}

	function getValue(node, valAttr) {
	    return parseInt(node.getAttribute(valAttr), 10);
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

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.setInitialPosition = setInitialPosition;
	exports.handlePosition = handlePosition;
	exports.handlePositionSteps = handlePositionSteps;

	function setInitialPosition(min, max, initValue) {
	    var range = max - min;
	    var percent = Math.round((initValue - min) * 100 / range);

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
/* 15 */
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
	    return el.innerHTML = value;
	}

	function setAttributeInDom(el, attr, value) {
	    return el.setAttribute(attr, value);
	}

/***/ }
/******/ ]);