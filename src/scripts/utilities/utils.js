'use strict';

export function getMin (node, minAttr) {
    return parseInt(node.getAttribute(minAttr), 10);
}

export function getMax (node, maxAttr) {
    return parseInt(node.getAttribute(maxAttr), 10);
}

export function getSteps (node, stepAttr) {
    return parseInt(node.getAttribute(stepAttr), 10);
}

export function getValue (node, valAttr) {
    return parseInt(node.getAttribute(valAttr), 10);
}

//-- Prevent text selection while dragging
export function pauseEvent(e) {
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

export function stopPropagation(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    e.cancelBubble = true;
}
