const webpack = require("webpack");
const { watch, parallel } = require("gulp");
const { readdirSync, statSync } = require("fs");

module.exports = function(setting) {
  const dir = setting.dir;

  function serviceWorkers() {
    let timestamp = Date.now();
    const files = getFilesList(dir.build, "").join('","');
    setting.findInFileAndReplace(`${dir.public}/service-worker.js`, /__TIMESTAMP__/g, timestamp, dir.build);
    setting.findInFileAndReplace(`${dir.build}/service-worker.js`, "__FILES__", `"${files}"`, dir.build);
    return Promise.resolve();
  }

  function compileTs() {
    const wpConfig = setting.getWebpackConfig(setting);
    if (setting.production) {
      copyFileSync(`${dir.resource}/gitignore/variantConfig.ts`, `${dir.src}/config/variantConfig.ts`);
    }

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
