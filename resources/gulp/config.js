const { join, parse, normalize } = require("path");
const { readFileSync, mkdirSync, writeFileSync } = require("fs");
const rimraf = require("rimraf");
const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const root = normalize(join(__dirname, "../.."));

const dir = {
    root: root,
    public: join(root, "public"),
    npm: join(root, "node_modules"),
    resource: join(root, "resources"),
    docker: join(root, "resources/docker"),
    src: join(root, "src"),
    gulp: join(root, "resources/gulp"),
    build: join(root, "vesta"),
};

const targets = {
    web: { build: "web/www" },
    electron: { build: "electron/www" },
    cordova: { build: "cordova/www" },
    android: { build: "cordova/www" },
    ios: { build: "cordova/www" }
};
targets.web.elimination = include("web");
targets.electron.elimination = include("electron");
targets.android.elimination = include("cordova", "android");
targets.ios.elimination = include("cordova", "ios");

module.exports = {
    dir,
    targets,
    getWebpackConfig,
    findInFileAndReplace,
    port: { http: 8088, api: 3000 },
    clean: (dir) => {
        rimraf.sync(dir);
    },
    error: (err) => {
        err && process.stderr.write(err.message);
    },
    buildPath: (target) => {
        if (targets[target].build) return targets[target].build;
        process.stderr.write(`Invalid build path for ${target} target`);
        process.exit(1);
    },
    is: (target, group) => {
        if (group === "web") return ["web"].indexOf(target) >= 0;
        if (group === "electron") return ["electron"].indexOf(target) >= 0;
        if (group === "cordova") return ["android", "ios", "cordova"].indexOf(target) >= 0;
        return false;
    },
};

function include(...includedTargets) {
    let elimination = [];
    Object.keys(targets).forEach(target => {
        if (includedTargets.indexOf(target) === -1) {
            elimination.push(target);
        }
    });
    return elimination;
}

function findInFileAndReplace(file, search, replace, destinationDirectory) {
    let content = readFileSync(file, { encoding: "utf8" });
    if (search && replace) {
        content = content.replace(search, replace);
    }
    let fileName = parse(file).base;
    let destination = destinationDirectory ? `${destinationDirectory}/${fileName}` : file;
    try {
        if (destinationDirectory) {
            mkdirSync(destinationDirectory);
        }
    } catch (e) {
        if (e.code !== "EEXIST") {
            console.error(`[gulp::config::findInFileAndReplace] ${e.message}`);
        }
    }
    try {
        writeFileSync(destination, content);
    } catch (e) {
        console.error(`[gulp::config::findInFileAndReplace::write] ${e.message}`);
    }
}

function getWebpackConfig(setting) {
    const target = setting.buildPath(setting.target);
    let plugins = [];

    const wpConfig = {
        target: "web",
        mode: setting.production ? "production" : "development",
        output: {
            filename: "[name].js",
            path: `${dir.build}/${target}/js`
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"]
        },
        module: {
            rules: [{
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            { loader: 'css-loader' },
                            { loader: 'sass-loader' },
                            // { loader: 'postcss-loader', options: { parser: 'sugarss', exec: true } }
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
        },
        plugins: [
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
        ],
        externals: {},
        optimization: {
            minimize: setting.production,
            splitChunks: {
                chunks: 'async',
                minSize: 30000,
                minChunks: 1,
                name: true,
                cacheGroups: {
                    commons: { test: /[\\/]node_modules[\\/]/, name: "lib", chunks: "all" }
                }
            },
        }
    }
    if (!setting.production) {
        wpConfig.devServer = {
            contentBase: `${dir.build}/${target}`,
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
        }
        wpConfig.devtool = "inline-source-map";
    }
    return wpConfig;
}