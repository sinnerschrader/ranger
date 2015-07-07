//-- Webpack requires the index.less file for compilation in the main js file.
//-- On Build it is removed by the extract-text-webpack-plugin.
//-- So don't worry the css is removed from the deliverable ranger.js.
import '../styles/index.less';

//-- Slider Dependencies
import Point from './slider.js';
let test = () => 'hello';
console.log(test, 'but now is working real real fine');
