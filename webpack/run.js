const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const config = require("./webpack.config");
const babel = require("@babel/core");
const ejs = require("ejs");
const { get } = require("http");
const { entry, output } = config;

const WEPACK_MODULE = [
  {
    "./webpack/demo.js": eval(
      "console.log(123)\n\n//# sourceURL=webpack://webpack-demo/./webpack/demo.js?"
    ),
  },
];
const __TO_WEBPACK_ENTRY__ = entry;

// 依赖收集

const parseFile = (file) => {
  const content = fs.readFileSync(file, "utf-8");
  const ast = parser.parse(content, { sourceType: "module" });
  const deps = {};
  traverse(ast, {
    ImportDeclaration(p) {
      // 将import转化为函数调用
      const dirname = path.dirname(file);
      const importFile = p.node.source.value;
      deps[p.node.source.value] = path.join(dirname, importFile);
      // // 获取文件路径
    },
  });

  // es6语法处理
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"],
  });
  return { file, deps, code };
};

const parseFiles = (file) => {
  const entry = parseFile(file);
  const temp = [entry];
  const depsGraph = {};

  getDeps(temp, entry);

  temp.forEach((info) => {
    depsGraph[info.file] = {
      deps: info.deps,
      code: info.code,
    };
  });

  return depsGraph;
};

// 获取依赖
const getDeps = (temp, entry) => {
  Object.keys(entry.deps).forEach((key) => {
    const child = parseFile(entry.deps[key]);
    temp.push(child);
    getDeps(temp, child);
  });
};

console.log(parseFiles(entry));

// 输出
fs.writeFileSync(path.join(output.path, output.filename), "123");
