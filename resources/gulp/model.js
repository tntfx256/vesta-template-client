const { src, dest, series } = require("gulp");
const ts = require("gulp-typescript");

module.exports = function(setting) {
    const dir = setting.dir;
    const buildPath = `${dir.build}/tmp`;

    function compileCmn() {
        let stream = src(`${dir.src}/cmn/**/*.ts`);
        let tsResult = stream.pipe(ts({
            target: "es5",
            noEmitHelpers: false,
            lib: ["esnext", "dom"],
            module: "commonjs"
        }));
        return tsResult.js.pipe(dest(`${buildPath}/cmn`));
    }

    series(compileCmn);

    return {};
};