const fs = require('fs');
const path = require('path');
const config = require("./webpack.config");
const ejs = require("ejs");
const {
    entry,
    output
} = config;

const WEPACK_MODULE = [{
    "./webpack/demo.js": eval("console.log(123)\n\n//# sourceURL=webpack://webpack-demo/./webpack/demo.js?")
}]
const __TO_WEBPACK_ENTRY__ = entry;





// 输出
fs.writeFileSync(path.join(output.path, output.filename), '123')

