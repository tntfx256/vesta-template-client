const { join, parse, normalize } = require("path");
const { readFileSync, mkdirSync, writeFileSync } = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const webpack = require("webpack");

const root = normalize(join(__dirname, "../.."));

const dir = {
    root: root,
    public: join(root, "public"),
    npm: join(root, "node_modules"),
    resource: join(root, "resources"),
    docker: join(root, "resources/docker"),
    src: join(root, "src"),
    public: join(root, "public"),
    gulp: join(root, "resources/gulp"),
    build: join(root, "vesta"),
};

const targets = {
    web: { build: "web/www" },
    // electron: { build: "electron/www" },
    cordova: { build: "cordova/www" },
    android: { build: "cordova/www" },
    ios: { build: "cordova/www" }
};
targets.web.elimination = include("web");
// targets.electron.elimination = include("electron");
targets.android.elimination = include("cordova", "android");
targets.ios.elimination = include("cordova", "ios");

module.exports = {
    dir,
    targets,
    clean: (dir) => {
        rimraf.sync(dir);
    },
    error: (err) => {
        err && process.stderr.write(err.message);
    },
    buildPath(target) {
        if (targets[target].build) return targets[target].build;
        process.stderr.write(`Invalid build path for ${target} target`);
        process.exit(1);
    },
    is(target, group) {
        if (group === "web") return ["web"].indexOf(target) >= 0;
        if (group === "electron") return ["electron"].indexOf(target) >= 0;
        if (group === "cordova") return ["android", "ios", "cordova"].indexOf(target) >= 0;
        return false;
    },
    findInFileAndReplace(file, search, replace, destinationDirectory) {
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
    },
    getWebpackConfig(setting) {
        const { dir } = setting;
        const target = setting.buildPath(setting.target);
        const wpConfig = {};

        wpConfig.mode = setting.production ? "production" : "development";
        wpConfig.target = setting.target;
        wpConfig.devtool = setting.production ? false : "inline-source-map";

        wpConfig.output = {
            filename: "[name].js",
            path: `${dir.build}/${target}/js`
        };
        wpConfig.resolve = {
            extensions: [".ts", ".tsx", ".js"],
            alias: {
                // "@vesta/components": path.resolve(`${dir.src}/vesta/components`),
                // "@vesta/services": path.resolve(`${dir.src}/vesta/services`),
                // "@vesta/culture": path.resolve(`${dir.src}/vesta/culture`),
                // "@vesta/culture-ir": path.resolve(`${dir.src}/vesta/culture-ir`),
                // "@vesta/culture-us": path.resolve(`${dir.src}/vesta/culture-us`),
            }
        };
        wpConfig.module = {
            rules: [{
                    test: /\.tsx?$/,
                    use: ["ts-loader"]
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
                }
            ]
        };
        wpConfig.plugins = [
            new webpack.ProvidePlugin({
                "__assign": ["tslib", "__assign"],
                "__extends": ["tslib", "__extends"],
            }),
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

        return wpConfig;
    }
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