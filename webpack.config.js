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
    wpConfig.entry = {
        index: "./src/index.tsx",
        app: "./src/app/app-init.scss",
        ltr: "./src/index-ltr.scss",
        rtl: "./src/index-rtl.scss",
    };
    wpConfig.output = {
        filename: "[name].js",
        path: `${dir.build}/${target}/js`
    };
    wpConfig.resolve = {
        extensions: [".ts", ".tsx", ".js", ".scss"]
    };
    wpConfig.module = {
        rules: [{
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader' },
                        { loader: 'sass-loader' },
                    ]

                })
            },
            {
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
    wpConfig.plugins = [
        new CleanWebpackPlugin(dir.build),
        new CopyWebpackPlugin([{
            from: `${dir.public}/**/*`,
            to: `${dir.build}/`,
            ignore: [`index.html`]
        }]),
        new ExtractTextPlugin({
            filename: `[name].css`,
            // allChunks: true,
        }),
        new HtmlWebpackPlugin({
            title: "Testing Title",
            template: "./public/index.html"
        }),
        new webpack.HotModuleReplacementPlugin(),
    ];
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
    wpConfig.devServer = {
        contentBase: dir.build,
        publicPath: '/',
        compress: true,
        disableHostCheck: true,
        historyApiFallback: true,
        host: "localhost",
        hot: true,
        https: false,
        inline: true,
        overlay: true,
        watchContentBase: true,
    };

    return wpConfig;
}