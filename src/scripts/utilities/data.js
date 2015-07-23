'use strict';

export let handleValue = (min, max, percentage) => {
    let maxRange = max - min;
    return Math.round(((percentage * maxRange) / 100) + min) ;
}

export let setValueInDom = (el, value) => {
    return el.textContent = value;
}

export let setAttributeInDom = (el, attr, value) => {
    return el.setAttribute(attr, value);
}
