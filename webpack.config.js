//-- Dependencies
var webpack             = require('webpack');
var path                = require('path');
var ExtractTextPlugin   = require('extract-text-webpack-plugin');

//-- Configuration Settings
var nameSpace           = 'ranger';
var outputPath          = __dirname + '/dist';
var scriptEntry         = './src/scripts/index.js';
var serverEntry         = 'webpack/hot/dev-server';
var excludeJs           = /node_modules/;
var scriptsPath         = path.join(__dirname, 'src/scripts');
var scriptsLoader       = 'babel-loader?experimental';
var autoprefix          = '{browsers:["last 2 version", "Explorer >= 9"]}';
var cssLoader           = ['css-loader', 'autoprefixer-loader?' + autoprefix];
var lessLoader          = cssLoader.slice(0);
    lessLoader.push('less-loader');

//-- Webpack Configuration
module.exports = {
    entry: {
        // scripts: [serverEntry, scriptEntry]
        scripts: [scriptEntry]
    },
    output: {
       path: outputPath,
       filename: nameSpace + '.js'
   },
   module: {
       loaders: [
            {
                 test: scriptsPath,
                 exclude: excludeJs,
                 loader: scriptsLoader
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style-loader', lessLoader.join('!'))
            }
       ]
   },
   plugins: [
       new ExtractTextPlugin(nameSpace + '.css')
   ],
    // devServer: {
    //     contentBase: outputPath,
    //     noInfo: false,
    //     hot: true,
    //     inline: true,
    //     stats: { colors: true }
    // }
}
