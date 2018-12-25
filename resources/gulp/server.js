const { copyFileSync } = require("fs-extra");
var browserSync = require('browser-sync').create();

module.exports = function(setting) {
    const dir = setting.dir;

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

    function runWebServer() {
        if (setting.production || setting.is(setting.target, "cordova")) {
            copyFileSync(`${dir.resource}/gitignore/variantConfig.ts`, `${dir.src}/app/config`);
        }
        return new Promise((resolve, reject) => {
            browserSync.init({
                ghostMode: false,
                single: true,
                server: {
                    baseDir: `${dir.build}/web/www`,
                    https: false,
                },
                watch: true,
            }, (error) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            });
        })
    }



    return {
        tasks: runServer,
        // watch: watches,
    };
};