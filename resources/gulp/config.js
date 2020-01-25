const { join, parse, normalize } = require("path");
const { readFileSync, mkdirSync, writeFileSync } = require("fs");
const rimraf = require("rimraf");
const webpack = require("webpack");

const root = normalize(join(__dirname, "../.."));

const dir = {
  root: root,
  build: join(root, "build"),
  public: join(root, "public"),
  npm: join(root, "node_modules"),
  resource: join(root, "resources"),
  docker: join(root, "resources/docker"),
  gulp: join(root, "resources/gulp"),
  src: join(root, "src"),
};

module.exports = {
  dir,
  clean: dir => {
    rimraf.sync(dir);
  },
  error: err => {
    err && process.stderr.write(err.message);
  },
  findInFileAndReplace(file, search, replace, destinationDirectory) {
    let content = readFileSync(file, { encoding: "utf8" });
    if (search && replace) {
      content = content.replace(search, replace);
    }
    let fileName = parse(file).base;
    let destination = destinationDirectory ? `${destinationDirectory}/${fileName}` : file;
    try {
      if (destinationDirectory) {
        mkdirSync(destinationDirectory);
      }
    } catch (e) {
      if (e.code !== "EEXIST") {
        console.error(`[gulp::config::findInFileAndReplace] ${e.message}`);
      }
    }
    try {
      writeFileSync(destination, content);
    } catch (e) {
      console.error(`[gulp::config::findInFileAndReplace::write] ${e.message}`);
    }
  },
  getWebpackConfig(setting) {
    const { dir } = setting;
    const wpConfig = {
      entry: { app: `${dir.src}/index.tsx` },
      target: "web",
      mode: setting.production ? "production" : "development",
      devtool: setting.production ? false : "inline-source-map",
      output: {
        filename: "[name].js",
        path: `${dir.build}/js`,
      },
      resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
          // "@vesta/components": path.resolve(`${dir.src}/vesta/components`),
          // "@vesta/services": path.resolve(`${dir.src}/vesta/services`),
          // "@vesta/culture": path.resolve(`${dir.src}/vesta/culture`),
          // "@vesta/culture-ir": path.resolve(`${dir.src}/vesta/culture-ir`),
          // "@vesta/culture-us": path.resolve(`${dir.src}/vesta/culture-us`),
        },
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: ["ts-loader"],
          },
          {
            test: /\.js$/,
            loader: `babel-loader`,
            exclude: /node_modules\/(?!(@vesta)\/).*/,
            query: {
              presets: [["@babel/env", { modules: false }]],
            },
          },
        ],
      },
      plugins: [
        new webpack.ProvidePlugin({
          __assign: ["tslib", "__assign"],
          __extends: ["tslib", "__extends"],
        }),
      ],
      optimization: {
        minimize: false,
        splitChunks: {
          chunks: "async",
          minSize: 30000,
          minChunks: 1,
          name: true,
          cacheGroups: {
            commons: { test: /[\\/]node_modules[\\/]/, name: "lib", chunks: "all" },
          },
        },
      },
      devServer: {
        contentBase: dir.build,
        compress: true,
        port: 9000,
      },
    };

    return wpConfig;
  },
};
