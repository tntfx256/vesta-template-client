const gulp = require('gulp');
const webpack = require('webpack');
const eliminator = require('./plugins/eliminator');

module.exports = function (setting) {
    let dir = setting.dir;
    let tmpClient = `${setting.dir.build}/tmp/client`;

    gulp.task('polyfill:preBuild', () => {
        return gulp.src(`${setting.dir.srcClient}/app/polyfill.ts`)
            .pipe(eliminator(setting))
            .pipe(gulp.dest(tmpClient))
    });

    gulp.task('polyfill:build', ['polyfill:preBuild'], () => {
        let target = setting.buildPath(setting.target);
        const compiler = webpack({
            entry: {
                polyfill: `${setting.dir.srcClient}/app/polyfill.ts`
            },
            output: {
                filename: "[name].js",
                path: `${dir.buildClient}/${target}/js`
            },
            resolve: {
                extensions: [".ts", ".tsx", ".js", ".json"]
            },
            module: {
                rules: [
                    {test: /\.tsx?$/, loader: `awesome-typescript-loader?sourceMap=false`}
                ]
            },
            plugins: [new webpack.optimize.UglifyJsPlugin({
                sourceMap: false,
                warnings: false,
            })]
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
