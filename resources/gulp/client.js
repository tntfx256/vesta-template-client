const webpack = require("webpack");
const { watch, parallel } = require("gulp");
const { copyFileSync } = require("fs-extra");
const { readdirSync, statSync } = require("fs");
var browserSync = require('browser-sync').get("vesta");

module.exports = function(setting) {
    const dir = setting.dir;

    function serviceWorkers() {
        if (setting.is(setting.target, "cordova")) return;
        let target = setting.buildPath(setting.target);
        let timestamp = Date.now();
        const files = getFilesList(`${dir.build}/${target}`, "").join('","');
        setting.findInFileAndReplace(`${dir.public}/service-worker.js`, /__TIMESTAMP__/g, timestamp, `${dir.build}/${target}`);
        setting.findInFileAndReplace(`${dir.build}/${target}/service-worker.js`, "__FILES__", `"${files}"`, `${dir.build}/${target}`);
        return Promise.resolve();
    }

    function compileTs() {
        const wpConfig = setting.getWebpackConfig(setting);
        if (setting.production || setting.is(setting.target, "cordova")) {
            copyFileSync(`${dir.resource}/gitignore/variantConfig.ts`, `${dir.src}/app/config`);
        }
        wpConfig.entry = { app: `${dir.src}/index` };

        webpack(wpConfig).run((err, stats) => {
            const info = stats.toJson();
            if (info.errors.length) {
                showErrors(info.errors);
            }
        });
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

    function showErrors(errors) {
        for (const error of errors) {
            console.error(error);
        }
    }

    return {
        tasks: parallel(serviceWorkers, compileTs),
        watch: watches,
    };
};