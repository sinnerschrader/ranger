'use strict';
//-- $todo: Explanation of this utility

export function handleDistance (offset, width) {
    let min      = 0;
    let max      = 100;
    let maxRange = (max - min);
    
    return (offset / width * maxRange + min);
 }
