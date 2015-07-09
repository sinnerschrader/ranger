'use strict';

export function handlePosition (offset, width) {
    let min      = 0;
    let max      = 100;
    let maxRange = (max - min);
    let position = (offset / width * maxRange + min);

    if (position <= min) {
        return min;
    }

    if (position >= max) {
        return max;
    }

    return position;
 }

// export function handlePosition (offset, width, min, max, value) {
//     let min      = 0;
//     let max      = 100;
//     let maxRange = (max - min);
//     let position = (offset / width * maxRange + min);
//
//     if (position <= min) {
//         return min;
//     }
//
//     if (position >= max) {
//         return max;
//     }
//
//     return position;
//  }


export function handleValue(min, max, percentage) {
    let maxRange = max - min;
    return ((percentage * maxRange) / 100) + min ;
}

export function setValueInDom(el, value) {
    return el.innerHTML = value;
}

export function setAttributeInDom(el, attr, value) {
    return el.setAttribute(attr, value);
}
