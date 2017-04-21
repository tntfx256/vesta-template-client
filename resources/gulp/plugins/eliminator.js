let through = require('through2');
let gulp = require('gulp');
let util = require('gulp-util');
let fs = require('fs');

const PluginError = util.PluginError;
const PLUGIN_NAME = 'eliminator';

module.exports = function (config, target) {
    target = target || 'client';
    let filePath = `${config.dir.root}/vesta.json`;
    if (!fs.existsSync(filePath)) {
        throw new PluginError(PLUGIN_NAME, `Config file was not found at '${root}/vesta.json'`);
    }

    return through.obj(function (file, encoding, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }
        if (file.isStream()) {
            throw new PluginError(PLUGIN_NAME, 'Streams are not supported');
        }
        if (file.isBuffer()) {
            return buildFor(file, target, cb);
        }
        cb(null, file);
    });

    function buildFor(file, target, cb) {
        let code = file.contents.toString();
        code = eliminateNotThis(code, target);
        let eliminations = config.targets[target].elimination;
        eliminations && eliminations.forEach(target => {
            code = eliminateOthers(code, target);
        });
        file.contents = Buffer.from(code);
        cb(null, file);
    }

    function eliminateOthers(code, target) {
        // let regex = new RegExp(`<${target}>[\\s\\S]+<\/${target}>`, 'g');
        // if(code.indexOf('qweasd')) {
        //     code = code.replace(regex, () => {
        //         console.log(arguments[0]);
        //     });
        // }
        let startIndex = -1;
        do {
            startIndex = code.indexOf(`//<${target}>`);
            if (startIndex >= 0) {
                let endCode = `//</${target}>`;
                let endIndex = code.indexOf(endCode) + endCode.length;
                code = code.substr(0, startIndex) + code.substr(endIndex);
            }
        } while (startIndex >= 0);
        return code;
    }

    function eliminateNotThis(code, target) {
        let startIndex = -1;
        do {
            startIndex = code.indexOf(`//<!${target}>`);
            if (startIndex >= 0) {
                let endCode = `//</${target}>`;
                let endIndex = code.indexOf(endCode) + endCode.length;
                code = code.substr(0, startIndex) + code.substr(endIndex);
            }
        } while (startIndex >= 0);
        return code;
    }
};
