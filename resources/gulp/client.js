const webpack = require("webpack");
const { watch, parallel, series } = require("gulp");
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
        const wpConfig = require("./webpack.config")(setting);
        if (setting.production || setting.is(setting.target, "cordova")) {
            setting.findInFileAndReplace(`${dir.resource}/gitignore/variantConfig.ts`, "", "", `${dir.src}/app/config`);
        }
        const compiler = webpack(wpConfig);
        return new Promise((resolve, reject) => {
            compiler.run((err, stats) => {
                if (err) {
                    console.error(err);
                    return reject(false);
                }
                const info = stats.toJson();
                if (stats.hasErrors()) {
                    process.stderr.write(info.errors.join("\n\n"));
                }
                resolve(true);
            });
        });
    }

    function runServer(cb) {
        if (setting.production) {
            return Promise.resolve();
        }

        switch (setting.target) {
            case "web":
                runWebServer();
                break;
            default:
                process.stderr.write(`${setting.target} Develop server is not supported`);
        }
        cb();
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
        try {
            exec(`npx webpack-dev-server --content-base ${dir.build}/web/www --compress --hot --inline --overlay --disable-host-check --open`);
            Promise.resolve();
        } catch (e) {
            Promise.reject(e);
        }
    }

    return {
        tasks: parallel(serviceWorkers, series(compileTs, runServer)),
        watch: watches,
    };
};