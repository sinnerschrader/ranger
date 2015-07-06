//-- Dependencies
var webpack             = require('webpack');
var path                = require('path');
var ExtractTextPlugin   = require("extract-text-webpack-plugin");

//-- Configuration Settings
var scriptEntry   = './src/scripts/index.js';
var stylesEntry   = './src/styles/styles.js';
var serverEntry   = 'webpack/hot/dev-server';
var outputPath    = __dirname + '/dist';
var scriptsPath   = path.join(__dirname, 'src/scripts');
var scriptsLoader = 'babel-loader?experimental';

module.exports = {
    entry: {
        scripts: ['webpack/hot/dev-server', scriptEntry]
        // styles: stylesEntry
    },
    output: {
       path: outputPath,
       filename: 'ranger.js'
   },
   module: {
       loaders: [
            {
                 test: scriptsPath,
                 exclude: /node_modules/,
                 loader: scriptsLoader
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader?{browsers:["last 2 version", "Explorer >= 9"]}',
                'less-loader')
            }
       ]
   },
   plugins: [
       new ExtractTextPlugin('ranger.css')
    //    new webpack.optimize.CommonsChunkPlugin('styles', 'styles.js', Infinity)
   ],
   devServer: {
        contentBase: outputPath,
        noInfo: false,
        hot: true,
        inline: true,
        stats: { colors: true }
    }
}
