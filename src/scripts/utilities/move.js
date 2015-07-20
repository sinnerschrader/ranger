'use strict';

export function handlePosition (offset, width) {
    let min      = 0;
    let max      = 100;
    let maxRange = (max - min);
    let position = Math.round((offset / width * maxRange + min));

    if (position <= min) {
        return min;
    }

    if (position >= max) {
        return max;
    }

    return position;
 }

 export function handlePositionSteps (offset, width, steps) {
     let min      = 0;
     let max      = 100;
     let maxRange = (max - min);
     let position = Math.round(((offset / width * maxRange + min) / steps)) * steps;

     if (position <= min) {
         return min;
     }

     if (position >= max) {
         return max;
     }

     return position;
 }
