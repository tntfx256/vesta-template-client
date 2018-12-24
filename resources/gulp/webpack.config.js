const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (setting) => {
    const { dir } = setting;
    const target = setting.buildPath(setting.target);
    const wpConfig = {}
    wpConfig.mode = setting.production ? "production" : "development";
    wpConfig.target = setting.target;
    wpConfig.output = {
        filename: "[name].js",
        path: `${dir.build}/${target}/js`
    };
    wpConfig.resolve = {
        extensions: [".ts", ".tsx", ".js", ".scss"]
    };
    wpConfig.module = {
        rules: [{
                test: /\.js$/,
                loader: `babel-loader`,
                exclude: /node_modules\/(?!(@vesta)\/).*/,
                query: {
                    presets: [
                        ["@babel/env", { "modules": false }]
                    ]
                }
            },
            {
                test: /\.tsx?$/,
                use: ["ts-loader"]
            },
        ]
    };
    wpConfig.plugins = [];
    wpConfig.optimization = {
        minimize: false,
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            name: true,
            cacheGroups: {
                commons: { test: /[\\/]node_modules[\\/]/, name: "lib", chunks: "all" }
            }
        },
    };
    // wpConfig.devServer = {
    //     contentBase: dir.build,
    //     publicPath: '/',
    //     compress: true,
    //     disableHostCheck: true,
    //     historyApiFallback: true,
    //     host: "localhost",
    //     hot: true,
    //     https: false,
    //     inline: true,
    //     overlay: true,
    //     watchContentBase: true,
    // };

    return wpConfig;
}