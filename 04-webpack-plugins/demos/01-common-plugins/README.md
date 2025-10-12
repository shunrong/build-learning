# Demo 1: 常用 Plugin 使用

演示主流 Webpack Plugin 的配置和使用。

---

## 📦 包含的 Plugin

### 1. HtmlWebpackPlugin
- ✅ 自动生成 HTML 文件
- ✅ 自动注入打包后的 JS 和 CSS
- ✅ 支持模板变量和自定义元数据
- ✅ 生产环境自动压缩

### 2. MiniCssExtractPlugin
- ✅ 将 CSS 提取到独立文件
- ✅ 开发环境使用 style-loader（热更新快）
- ✅ 生产环境提取 CSS（利用缓存）
- ✅ 支持 contenthash 长期缓存

### 3. DefinePlugin
- ✅ 定义全局常量
- ✅ 注入环境变量
- ✅ 注入版本信息
- ✅ 注入构建时间

### 4. CopyWebpackPlugin
- ✅ 复制静态资源到输出目录
- ✅ 支持 glob 模式匹配
- ✅ 可以转换文件内容
- ✅ 自动创建目标目录

### 5. BundleAnalyzerPlugin
- ✅ 可视化打包产物
- ✅ 分析模块大小
- ✅ 找出体积大的模块
- ✅ 优化打包体积

---

## 🚀 运行方式

### 1. 安装依赖

```bash
npm install
```

### 2. 开发模式

```bash
npm run dev
```

**效果**：
- ✅ 启动开发服务器
- ✅ 自动打开浏览器
- ✅ CSS 通过 style-loader 注入（热更新快）
- ✅ 支持 HMR

### 3. 生产构建

```bash
npm run build
```

**效果**：
- ✅ CSS 提取到独立文件
- ✅ 文件名包含 contenthash
- ✅ HTML 自动压缩
- ✅ 复制 public 目录

### 4. 打包分析

```bash
npm run analyze
```

**效果**：
- ✅ 生成打包分析报告
- ✅ 自动打开浏览器查看
- ✅ 可视化模块大小

---

## 📁 输出目录结构

### 开发模式

```
dist/
├── index.html          # HtmlWebpackPlugin 生成
├── main.js             # 打包的 JS（包含 CSS）
└── public/             # CopyWebpackPlugin 复制
    └── test.txt
```

### 生产模式

```
dist/
├── index.html                    # 压缩后的 HTML
├── js/
│   └── main.abc12345.js         # 带 hash 的 JS
├── css/
│   └── main.def67890.css        # 提取的 CSS（带 hash）
├── public/                       # 静态资源
│   └── test.txt
└── bundle-report.html            # 分析报告（analyze 模式）
```

---

## 🎯 学习要点

### 1. HtmlWebpackPlugin 配置

```javascript
new HtmlWebpackPlugin({
  template: './src/index.html',    // 模板文件
  title: '页面标题',                // 标题
  meta: {                          // 元数据
    viewport: 'width=device-width',
    description: '描述'
  },
  minify: !isDev                   // 生产环境压缩
})
```

**模板中使用变量**：

```html
<title><%= htmlWebpackPlugin.options.title %></title>
```

---

### 2. MiniCssExtractPlugin 配置

```javascript
// Loader 配置
{
  test: /\.css$/,
  use: [
    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
    'css-loader'
  ]
}

// Plugin 配置
new MiniCssExtractPlugin({
  filename: 'css/[name].[contenthash:8].css'
})
```

**为什么要区分开发和生产？**

| 环境 | Loader | 优势 |
|------|--------|------|
| 开发 | style-loader | 热更新快 |
| 生产 | MiniCssExtractPlugin | 并行加载、长期缓存 |

---

### 3. DefinePlugin 配置

```javascript
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production'),
  '__VERSION__': JSON.stringify('1.0.0'),
  '__BUILD_TIME__': JSON.stringify(new Date().toISOString())
})
```

**注意**：值会被直接替换，所以需要 `JSON.stringify()`

```javascript
// 源代码
if (process.env.NODE_ENV === 'production') {
  console.log('生产环境');
}

// 编译后
if ('production' === 'production') {
  console.log('生产环境');
}
```

---

### 4. CopyWebpackPlugin 配置

```javascript
new CopyWebpackPlugin({
  patterns: [
    {
      from: 'public',           // 源目录
      to: 'public',             // 目标目录
      noErrorOnMissing: true    // 源不存在不报错
    }
  ]
})
```

**适用场景**：
- ✅ favicon.ico
- ✅ robots.txt
- ✅ manifest.json
- ✅ 第三方库的静态文件

**不适用场景**：
- ❌ 图片（用 asset modules）
- ❌ 字体（用 asset modules）
- ❌ CSS/JS（用 import）

---

### 5. BundleAnalyzerPlugin 配置

```javascript
new BundleAnalyzerPlugin({
  analyzerMode: 'static',           // 生成静态 HTML
  reportFilename: 'report.html',    // 报告文件名
  openAnalyzer: true                // 自动打开
})
```

**使用技巧**：
- 只在需要时启用（通过环境变量）
- 找出体积大的模块
- 检查是否有重复的依赖
- 优化打包策略

---

## 🔍 观察要点

### 1. 开发模式 vs 生产模式

**开发模式**：
```bash
npm run dev
```

- 打开开发者工具 → Elements
- 查看 `<style>` 标签（style-loader 注入）
- 修改 CSS 文件，观察热更新

**生产模式**：
```bash
npm run build
```

- 查看 `dist/` 目录结构
- 打开 `dist/index.html`
- 查看 `<link>` 标签（提取的 CSS）

---

### 2. DefinePlugin 注入的变量

打开控制台，查看输出：

```javascript
console.log('环境变量:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  VERSION:', __VERSION__);
console.log('  BUILD_TIME:', __BUILD_TIME__);
```

---

### 3. CopyWebpackPlugin 复制的文件

点击页面上的"检查public文件"按钮，验证文件是否被复制。

或者手动访问：
```
http://localhost:8080/public/test.txt
```

---

### 4. 打包分析

```bash
npm run analyze
```

观察：
- 哪些模块占用空间最大？
- 是否有重复的依赖？
- 可以优化的点在哪里？

---

## 💡 实验建议

### 实验 1：修改 HtmlWebpackPlugin 配置

```javascript
new HtmlWebpackPlugin({
  title: '修改后的标题',
  meta: {
    keywords: '关键词1,关键词2'
  }
})
```

观察 HTML 的变化。

---

### 实验 2：对比开发和生产模式

```bash
# 开发模式构建
npm run build:dev

# 生产模式构建
npm run build
```

对比 `dist/` 目录的差异。

---

### 实验 3：添加更多静态资源

在 `public/` 目录添加更多文件，观察是否被复制。

---

### 实验 4：分析打包产物

```bash
npm run analyze
```

尝试：
- 找出最大的模块
- 查看依赖关系
- 思考优化方案

---

## 📚 相关文档

- [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin)
- [MiniCssExtractPlugin](https://webpack.js.org/plugins/mini-css-extract-plugin/)
- [DefinePlugin](https://webpack.js.org/plugins/define-plugin/)
- [CopyWebpackPlugin](https://webpack.js.org/plugins/copy-webpack-plugin/)
- [BundleAnalyzerPlugin](https://github.com/webpack-contrib/webpack-bundle-analyzer)

---

## 🎯 检验标准

完成这个 Demo 后，你应该能够：

- [ ] 理解每个 Plugin 的作用
- [ ] 能够正确配置各个 Plugin
- [ ] 理解开发和生产环境的差异
- [ ] 能够使用 BundleAnalyzer 分析打包
- [ ] 能够根据需求选择合适的 Plugin

---

**继续学习**：[Demo 2: 生命周期演示](../02-lifecycle-demo/)

