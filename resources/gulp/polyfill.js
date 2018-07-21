const gulp = require('gulp');
const webpack = require('webpack');
const eliminator = require('./plugins/eliminator');

module.exports = function(setting) {
    let dir = setting.dir;
    let tmpClient = `${setting.dir.build}/tmp`;

    gulp.task('polyfill:preBuild', () => {
        return gulp.src(`${setting.dir.src}/app/polyfill.ts`)
            .pipe(eliminator(setting))
            .pipe(gulp.dest(tmpClient))
    });

    gulp.task('polyfill:build', ['polyfill:preBuild'], () => {
        let target = setting.buildPath(setting.target);
        const compiler = webpack({
            entry: {
                polyfill: `${setting.dir.src}/app/polyfill.ts`
            },
            output: {
                filename: "[name].js",
                path: `${dir.build}/${target}/js`
            },
            mode: "production",
            resolve: {
                extensions: [".ts", ".tsx", ".js", ".json"]
            },
            module: {
                rules: [
                    { test: /\.tsx?$/, loader: `ts-loader` }
                ]
            },
            plugins: []
        });

        return new Promise((resolve, reject) => {
            compiler.run((err, stats) => {
                if (err) {
                    console.error(err);
                    return reject(false);
                }
                const info = stats.toJson();
                if (stats.hasErrors()) {
                    process.stderr.write(info.errors.join('\n\n'));
                }
                resolve(true);
            });
        })
    });

    return {
        watch: [],
        tasks: ['polyfill:build']
    };
};
