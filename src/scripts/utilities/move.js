'use strict';

export function handlePosition (offset, width) {
    let min      = 0;
    let max      = 100;
    let ratio    = Math.min(Math.max(offset / width, min), 1);
    let range    = (max - min);
    let percent = Math.round((ratio * range) + min);

    return percent;
 }

 export function handlePositionSteps (offset, width, min, max, stepWidth) {
     let ratio      = Math.min(Math.max(offset / width, 0), 1);
     let range      = (max - min);
     let currentStep= Math.round((ratio * range) / stepWidth);
     let percent   = ((currentStep * stepWidth) / range) * 100;

     return percent;
 }
