'use strict';
//-- Webpack requires the index.less file for compilation in the main js file.
//-- On Build it is removed by the extract-text-webpack-plugin.
//-- So don't worry the css is removed from the deliverable ranger.js.
import '../styles/index.less';
//-- The end of the css import

//-- Create Slider
import createSlider from './slider';

const RANGER = createSlider();
console.log(RANGER);
