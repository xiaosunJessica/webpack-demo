const Koa = require("koa");
const fs = require("fs");
const path = require("path");
const app = new Koa();
const compilerSFC = require("react-sfc");
app.use(async (ctx) => {
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
    // 这是⼀个node_module⾥的东⻄
    const prefix = path.resolve(
      __dirname,
      "node_modules",
      url.replace("/@modules/", "")
    );
    const module = require(prefix + "/package.json").module;
    console.log(module, "modulemodulemodule");
    const p = path.resolve(prefix, module);
    const ret = fs.readFileSync(p, "utf-8");
    ctx.type = "application/javascript";
    ctx.body = rewriteImport(ret);
  } else if (url.indexOf(".tsx") > -1) {
    // 获取加载文件路径
    const p = path.join(__dirname, url.split("?")[0]);
    const ret = compilerSFC.Compiler(fs.readFileSync(p, "utf8"));
    console.log("retretret:", ret);
    if (!query.type) {
      // SFC请求
      // 读取vue文件，解析为js
      // 获取脚本部分的内容
      const scriptContent = ret.descriptor.script.content;
      // 替换默认导出为一个常量，方便后续修改
      const script = scriptContent.replace(
        "export default ",
        "const __script = "
      );
      ctx.type = "application/javascript";
      ctx.body = `
        ${rewriteImport(script)}
        // 解析tpl
        import {render as __render} from '${url}?type=template'
        __script.render = __render
        export default __script
      `;
    } else if (query.type === "template") {
      // const tpl = ret.descriptor.template.content;
      // // 编译为render
      // const render = compilerDOM.compile(tpl, { mode: "module" }).code;
      // ctx.type = "application/javascript";
      // ctx.body = rewriteImport(render);
    }
  }
});
app.listen(3000, () => {
  console.log("Vite Start ....");
});

function rewriteImport(content) {
  return content.replace(/ from ['"](.*)['"]/g, function (s1, s2) {
    if (s2.startsWith("./") || s2.startsWith("/") || s2.startsWith("../")) {
      return s1;
    } else {
      // 裸模块，替换
      return ` from '/@modules/${s2}'`;
    }
  });
}
