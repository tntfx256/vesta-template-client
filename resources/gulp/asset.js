const { src, dest, parallel, series, watch } = require("gulp");
const htmlMin = require("gulp-htmlmin");
const replace = require("gulp-replace");

module.exports = function(setting) {
  let dir = setting.dir;

  function index() {
    const timestamp = Date.now();
    let stream = src(`${dir.public}/index.html`)
      //   .pipe(eliminator(setting))
      .pipe(replace("__TIMESTAMP__", timestamp));
    if (setting.production) {
      stream = minifyHtml(stream).on("error", setting.error);
    }
    return stream.pipe(dest(dir.build));
  }

  function root() {
    return src([`${dir.public}/*`, `!${dir.public}/index.html`, `!${dir.src}/*.js`]).pipe(dest(dir.build));
  }

  function fonts() {
    src([`${dir.npm}/md-font/*.{eot,ijmap,svg,ttf,woff,woff2}`]).pipe(dest(`${dir.build}/fonts/material-icon`));
    return src([`${dir.public}/fonts/**/*`]).pipe(dest(`${dir.build}/fonts`));
  }

  function images() {
    let stream = src(`${dir.public}/images/**/*`);
    return stream.pipe(dest(`${dir.build}/images`));
  }

  function watches() {
    watch([`${dir.src}/*`, `!${dir.src}/*.js`], root);
    watch([`${dir.src}/fonts/**/*`], fonts);
    watch([`${dir.src}/images/**/*`], images);
  }

  function minifyHtml(stream) {
    return stream.pipe(
      htmlMin({
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        collapseBooleanAttributes: true,
        keepClosingSlash: true,
      })
    );
  }

  return {
    tasks: parallel(series(index, root), fonts, images),
    watch: watches,
  };
};
