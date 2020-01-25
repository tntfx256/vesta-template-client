const browserSync = require("browser-sync").create("vesta");

module.exports = function(setting) {
  const dir = setting.dir;

  function runWebServer() {
    return new Promise((resolve, reject) => {
      browserSync.init(
        {
          ghostMode: false,
          single: true,
          server: {
            baseDir: dir.build,
            https: false,
          },
          watch: true,
        },
        error => {
          if (error) {
            return reject(error);
          }
          resolve();
        }
      );
    });
  }

  return {
    tasks: runWebServer,
    // watch: ,
  };
};
