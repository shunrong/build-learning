这是一个文本文件演示 (asset/source)

Webpack 5 引入了 Asset Modules，
替代了之前的 file-loader、url-loader 和 raw-loader。

四种类型：
1. asset/resource - 输出文件
2. asset/inline - 转 base64
3. asset - 自动选择
4. asset/source - 导出源码

这个文件使用 asset/source 类型，
会被作为字符串导入到 JavaScript 模块中。

