const { copyFileSync } = require("fs");

function copyStyles() {
    copyFileSync("node_modules/@vesta/components/css/index-ltr.css", "public/css/components-ltr.css");
    copyFileSync("node_modules/@vesta/components/css/index-rtl.css", "public/css/components-rtl.css");
    return Promise.resolve();
}

module.exports = {
    default: copyStyles
}