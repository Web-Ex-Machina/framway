/*
* This file was generated with webpack-create-config version 1.0.0
* please run the following command to install dependencies
* npm install --save-dev webpack babel-loader babel-core babel-preset-es2015 style-loader css-loader
* or with yarn
* yarn add webpack babel-loader babel-core babel-preset-es2015 style-loader css-loader
*/
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var LiveReloadPlugin = require('webpack-livereload-plugin');
var WebpackSynchronizableShellPlugin = require('webpack-synchronizable-shell-plugin');
const webpack = require('webpack'); //to access built-in plugins
const path = require('path');
module.exports = {
    entry: {
        vendor : './vendor', // split vendors from app's file, in order to optimize the building process
        framway : './src'
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, './build'),
        // publicPath: '/files/APPFOLDERNAME/build/',
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
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {loader: "css-loader",
                            options:{
                                sourceMap:true, // enable sourcemap
                                minimize: true, // minimize css
                                module: true,  // enable use of imported css as js object
                                localIdentName: '[local]', // used to keep the right name of a css class instead of a hash
                            }
                        },
                        {loader: "postcss-loader", options:{sourceMap:true}},
                        {loader: "sass-loader", options:{sourceMap:true}},
                    ],
                    publicPath: '../'
                })
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'img/[name].[ext]'
                    }
                }]
            }
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
        new ExtractTextPlugin({
            filename : "css/[name].css",
        }),
        new webpack.ProvidePlugin({
            utils: 'utils',
            $: "jquery",
            jQuery: "jquery", // enable $ and jQuery as global variables
            Tether: 'tether',
            tether: 'tether' // enable tether as global variable (required by bootstrap 4)
        }),
        new HtmlWebpackPlugin({
            title: 'Framway\'s home',
            template: './src/index.html',
            filename: './index.html',
            chunks: ['vendor', 'framway'],
            chunksSortMode: 'manual',
        })
    ]
};