'use strict';

export function getNumber (node, value) {
    return parseInt(node.getAttribute(value), 10);
}

//-- Prevent text selection while dragging
export function pauseEvent (e) {
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

export function stopPropagation (e) {
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

export function debounce (func, wait, immediate) {
	let timeout;
	return function () {

		let context = this;
        let args = arguments;

		let later = function() {
			timeout = null;
			if (!immediate) {
                func.apply(context, args);
            }
		};

		let callNow = immediate && !timeout;
		clearTimeout(timeout);

		timeout = setTimeout(later, wait);

		if (callNow) {
            func.apply(context, args);
        }
	};
};

//-- requestAnimationFrame polyfill
//-- https://gist.github.com/paulirish/1579671
export function requestAnim () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}
requestAnim();
