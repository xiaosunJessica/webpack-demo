const Koa = require("koa");
const fs = require("fs");
const path = require("path");
const app = new Koa();
// import { transformSync } from "esbuild";
const esbuild = require("esbuild");
app.use(async (ctx: any) => {
  const {
    request: { url, query },
  } = ctx;
  // ⾸⻚
  if (url == "/") {
    ctx.type = "text/html";
    console.log(__dirname, "__dirname__dirname");

    let content = fs.readFileSync(
      path.join(__dirname, "./index.html"),
      "utf-8"
    );
    ctx.body = content;
  } else if (url.endsWith(".js")) {
    // js文件加载处理
    const p = path.join(__dirname, url);
    console.log(p);
    ctx.type = "application/javascript";
    ctx.body = rewriteImport(fs.readFileSync(p, "utf8"));
  } else if (url.startsWith("/@modules/")) {
    // 裸模块名称
    const moduleName = url.replace("/@modules/", "");
    // 去node_modules目录中找
    // 这是⼀个node_module⾥的东⻄
    const prefix = path.join(__dirname, "../node_modules", moduleName);
    let main = require(prefix + "/package.json").main;
    const pkgPath = path.join(prefix, main);
    let body = {};

    // 尝试去获取 /node_modules/.vite 下的编译过后的文件
    try {
      body = fs.readFileSync(
        `${path.join(__dirname, "../node_modules")}/.vite/${moduleName}.js`
      );
    } catch (err) {
      // 如果获取不到，使用 ESBuild 打包裸模块里的内容，转换为 ESM 供浏览器使用
      // 并且存入 /node_modules/.vite 缓存目录中
      // 这步操作其实就是 vite 在预编译执行的
      esbuild.buildSync({
        entryPoints: [pkgPath],
        bundle: true,
        outfile: `${path.join(
          __dirname,
          "../node_modules"
        )}/.vite/${moduleName}.js`,
        format: "esm",
      });
      // 最后返回当前编译后的 JS 文件
      body = fs.readFileSync(
        `${path.join(__dirname, "../node_modules")}/.vite/${moduleName}.js`
      );
    }

    ctx.type = "application/javascript";
    ctx.body = body;
  } else if (url.indexOf(".tsx") > -1) {
    // 获取加载文件路径
    const filePath = path.join(__dirname, url.split("?")[0]);
    const content = rewriteImport(fs.readFileSync(filePath).toString());
    const out = esbuild.transformSync(content, {
      jsxFragment: "Fragment",
      loader: "jsx",
    });
    ctx.type = "application/javascript";
    ctx.body = out.code;
    // const JSXFile
  }
});
app.listen(3000, () => {
  console.log("Vite Start ....");
});

function rewriteImport(content: string) {
  return content.replace(/ from ['"](.*)['"]/g, function (s1, s2) {
    if (s2.startsWith("./") || s2.startsWith("/") || s2.startsWith("../")) {
      return s1;
    } else {
      // 裸模块，替换
      return ` from '/@modules/${s2}'`;
    }
  });
}
