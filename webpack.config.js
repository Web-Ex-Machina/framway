const framwayConfig = require('./framway.config.js');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackInlineStylePlugin = require('html-webpack-inline-style-plugin');
var LiveReloadPlugin = require('webpack-livereload-plugin');
var WebpackSynchronizableShellPlugin = require('webpack-synchronizable-shell-plugin');

const WebpackBar = require('webpackbar');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const webpack = require('webpack'); //to access built-in plugins
const path = require('path');
const fs = require('fs');

function generateHtmlPlugins (templateDir,targetPath = '') {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))
  const arrResults = [];
  templateFiles.forEach(function(item){
    const parts = item.split('.')
    const name = parts[0]
    const ext = parts[1]
    if(ext == 'html'){
        arrResults.push(
            new HtmlWebpackPlugin({
                filename: `${targetPath}${name}.${ext}`,
                template: `${templateDir}${name}.${ext}`,
                inject: false
            })
        );
    }
  });
  return arrResults;
}

var htmlEmails = generateHtmlPlugins('./src/emails/','emails/');
fs.readdirSync(path.resolve(__dirname, './src/themes/')).forEach(function(theme){
    if(framwayConfig.themes.indexOf(theme) != -1 && fs.existsSync('./src/themes/'+theme+'/emails/'))
        htmlEmails = htmlEmails.concat(generateHtmlPlugins('./src/themes/'+theme+'/emails/','emails/'))
})


// module.exports = smp.wrap({
module.exports = {
    entry: {
        vendor  : './vendor', // split vendors from app's file, in order to optimize the building process
        framway : './src',
    },
    output: {
        filename   : 'js/[name].js',
        path       : path.resolve(__dirname, './build'),
        publicPath : './'
    },
    module: {
        rules: [
            {
                test: /\.js$/, // watch for js files
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',  // transpile es6 javascript to es5
                    options: {
                        presets: ['es2015',],
                    },
                },
            },
            {
                test: /\.s?css$/,  // will watch either for css or scss files
                exclude: /(emails)/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {loader: "css-loader",
                            options:{
                                sourceMap:true, // enable sourcemap
                                // minimize: true, // minimize css
                                // module: true,  // enable use of imported css as js object
                                context: '/',
                                modules: true,  // enable use of imported css as js object
                                localIdentName: '[local]', // used to keep the right name of a css class instead of a hash
                            }
                        },
                        {loader: "postcss-loader", options:{sourceMap:true}},
                        {loader: "fast-sass-loader", options:{sourceMap:true}},
                    ],
                    publicPath: '../'
                })
            },
            {
                test: /\.html$/,  // will watch either for css or scss files
                include: /(emails)/,
                use: [{
                    loader: 'html-loader?interpolate=require'
                }]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'img/[name].[ext]'
                    }
                }]
            },
        ],
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js'],
        alias: {
            'utils': path.resolve(__dirname, './src/js/utils')  // <-- When you build or restart dev-server, you'll get an error if the path to your utils.js file is incorrect.
        }
    },
    plugins: [
        new WebpackBar(),
        new WebpackSynchronizableShellPlugin({
            onBuildStart:{
                scripts: ['npm run prepare'],
                blocking: true,
                parallel: false
            },
            // onBuildEnd:{},
            dev: false,
        }),
        new LiveReloadPlugin(),
        new webpack.ProvidePlugin({
            utils: 'utils',
            $: "jquery",
            jQuery: "jquery", // enable $ and jQuery as global variables
            Tether: 'tether',
            tether: 'tether' // enable tether as global variable (required by bootstrap 4)
        }),
        new ExtractTextPlugin({filename : "css/[name].css"}),
        new HtmlWebpackPlugin({
            title: 'Framway\'s home',
            template: './src/index.html',
            filename: './index.html',
            chunks: ['vendor', 'framway'],
            chunksSortMode: 'manual',
        }),
        new HtmlWebpackInlineStylePlugin(), // used to report styles in <style> to their respective tag's style attribute
    ]
    .concat(htmlEmails)
};
// });

// console.log('\n ---------------- \n '+framwayConfig.themes.indexOf(theme)+' \n ---------------- \n');
