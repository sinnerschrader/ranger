'use strict';

export function handleValue (min, max, percentage) {
    let maxRange = max - min;
    return ((percentage * maxRange) / 100) + min ;
}
