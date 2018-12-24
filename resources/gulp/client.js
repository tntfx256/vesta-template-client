const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const { watch, parallel, series, src } = require("gulp");
const { copyFileSync } = require("fs-extra");
const { readdirSync, statSync } = require("fs");
const { exec } = require("child_process");

module.exports = function(setting) {
    const dir = setting.dir;

    function serviceWorkers() {
        if (setting.is(setting.target, "cordova")) return;
        let target = setting.buildPath(setting.target);
        let timestamp = Date.now();
        const files = getFilesList(`${dir.build}/${target}`, "").join('","');
        setting.findInFileAndReplace(`${dir.public}/service-worker.js`, /__TIMESTAMP__/g, timestamp, `${dir.build}/${target}`);
        setting.findInFileAndReplace(`${dir.build}/${target}/service-worker.js`, "__FILES__", files, `${dir.build}/${target}`);
        return Promise.resolve();
    }

    function compileTs() {
        const wpConfig = setting.getWebpackConfig(setting);
        if (setting.production || setting.is(setting.target, "cordova")) {
            copyFileSync(`${dir.resource}/gitignore/variantConfig.ts`, `${dir.src}/app/config`);
        }
        wpConfig.entry = { app: `${dir.src}/index` };
        return new Promise((resolve, reject) => {
            webpack(wpConfig).run((err, stats) => {
                if (err) {
                    return reject(err);
                }
                const info = stats.toJson();
                if (stats.hasErrors()) {
                    process.stderr.write(info.errors.join("\n\n"));
                }
                resolve(true);
            });
        });
    }

    function runServer() {
        if (setting.production) {
            return Promise.resolve();
        }

        switch (setting.target) {
            case "web":
                return runWebServer();
            default:
                process.stderr.write(`${setting.target} Develop server is not supported`);
        }
        return Promise.resolve();
    }

    function watches() {
        watch([`${dir.src}/**/*.ts*`], compileTs);
        watch([`${dir.src}/*.js`], serviceWorkers);
    }

    function getFilesList(dir, base) {
        let files = [];
        const thisList = readdirSync(dir);
        for (let i = 0, il = thisList.length; i < il; ++i) {
            const thisPath = `${dir}/${thisList[i]}`;
            const stat = statSync(thisPath);
            if (stat.isFile()) {
                files.push(`${base}${thisList[i]}`);
            } else {
                files = files.concat(getFilesList(`${dir}/${thisList[i]}`, `${base}${thisList[i]}/`));
            }
        }
        return files;
    }

    function runWebServer() {
        const wpConfig = setting.getWebpackConfig(setting);
        if (setting.production || setting.is(setting.target, "cordova")) {
            copyFileSync(`${dir.resource}/gitignore/variantConfig.ts`, `${dir.src}/app/config`);
        }
        wpConfig.dev
        return new Promise((resolve, reject) => {
            const server = new WebpackDevServer(webpack(wpConfig), {
                contentBase: `${dir.build}/web/www`,
                // publicPath: `/`,
                stats: {
                    colors: true
                }
            });
            server.listen(8080, "localhost", function(err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        })
    }

    return {
        tasks: parallel(serviceWorkers, series(compileTs, runServer)),
        watch: watches,
    };
};