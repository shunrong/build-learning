# Demo 1: CSS Loader 基础

## 📚 学习目标

- 理解 `css-loader` 和 `style-loader` 的作用
- 掌握 CSS Modules 的使用
- 理解开发环境和生产环境的 CSS 处理差异
- 观察 HMR（热模块替换）效果

---

## 🎯 涉及知识点

### 1. css-loader

**作用**：解析 CSS 文件，处理 `@import` 和 `url()`

```javascript
{
  test: /\.css$/,
  use: 'css-loader'
}
```

**功能**：
- 解析 `@import` 语句
- 解析 `url()` 引用
- 将 CSS 转换为 JavaScript 模块

---

### 2. style-loader

**作用**：将 CSS 注入到 DOM 的 `<style>` 标签

```javascript
{
  test: /\.css$/,
  use: ['style-loader', 'css-loader']
}
```

**特点**：
- ✅ 支持 HMR
- ✅ 开发环境友好
- ⚠️ CSS 在 JS 中，增加 bundle 体积

---

### 3. MiniCssExtractPlugin

**作用**：将 CSS 提取到独立文件

```javascript
{
  test: /\.css$/,
  use: [MiniCssExtractPlugin.loader, 'css-loader']
}
```

**特点**：
- ✅ CSS 独立文件
- ✅ 支持长期缓存
- ⚠️ 不支持 HMR

---

### 4. CSS Modules

**作用**：CSS 局部作用域，避免全局污染

```javascript
{
  test: /\.module\.css$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: true
      }
    }
  ]
}
```

**效果**：类名会被哈希化
- `.button` → `.Button_button__a1b2c`

---

## 🚀 运行步骤

### 1. 安装依赖

```bash
npm install
```

---

### 2. 开发模式

```bash
npm run dev
```

浏览器自动打开 http://localhost:3000

**观察点**：
1. 打开开发者工具 → Elements
2. 在 `<head>` 中找到 `<style>` 标签
3. CSS 以内联形式注入

---

### 3. 修改 CSS，体验 HMR

修改 `src/styles/main.css`：

```css
.normal-box {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);  /* 改变颜色 */
}
```

**观察**：
- 页面无需刷新
- 样式立即更新
- 控制台输出 "CSS 热更新！"

---

### 4. 生产构建

```bash
npm run build
```

查看 `dist/` 目录：

```
dist/
├── index.html
├── main.abc123.js       # JavaScript
└── main.def456.css      # CSS 独立文件
```

**观察点**：
1. CSS 被提取到独立文件
2. 文件名包含 contenthash
3. `index.html` 中有 `<link>` 标签引用 CSS

---

### 5. 观察 CSS Modules

打开浏览器控制台：

```javascript
// 查看导入的对象
import buttonStyles from './styles/Button.module.css';
console.log(buttonStyles);

// 输出：
{
  button: "Button_button__a1b2c",
  primary: "Button_primary__d4e5f",
  secondary: "Button_secondary__g6h7i"
}
```

在 Elements 面板查看 DOM：

```html
<button class="Button_button__a1b2c Button_primary__d4e5f">
  主要按钮
</button>
```

---

## 📊 对比观察

### style-loader vs MiniCssExtractPlugin

| 特性 | style-loader（开发） | MiniCssExtractPlugin（生产） |
|------|---------------------|----------------------------|
| **CSS 位置** | `<style>` 标签 | 独立 `.css` 文件 |
| **HMR** | ✅ 支持 | ❌ 不支持 |
| **加载方式** | 运行时注入 | `<link>` 引用 |
| **缓存** | 跟随 JS | 独立缓存 |
| **FOUC** | ⚠️ 可能闪烁 | ✅ 无闪烁 |

---

### 开发模式 HTML

```html
<head>
  <style>
    /* main.css 内容 */
    .container { ... }
  </style>
  <style>
    /* Button.module.css 内容 */
    .Button_button__a1b2c { ... }
  </style>
</head>
```

---

### 生产模式 HTML

```html
<head>
  <link rel="stylesheet" href="main.def456.css">
</head>
```

---

## 🔍 核心配置解析

### webpack.config.js

```javascript
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  module: {
    rules: [
      // 1. 普通 CSS
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      
      // 2. CSS Modules
      {
        test: /\.module\.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: isDev 
                  ? '[path][name]__[local]--[hash:base64:5]'  // 开发：可读
                  : '[hash:base64:8]'                          // 生产：精简
              }
            }
          }
        ]
      }
    ]
  },
  
  plugins: [
    !isDev && new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css'
    })
  ].filter(Boolean)
};
```

---

## 💡 关键点

### 1. Loader 执行顺序

```
CSS 文件
    ↓ css-loader（解析 CSS）
JavaScript 模块
    ↓ style-loader（注入 DOM）
<style> 标签
```

---

### 2. @import 处理

`main.css`:
```css
@import './base.css';
```

**css-loader** 会：
1. 读取 `base.css`
2. 合并到 `main.css`
3. 一起转换为 JS 模块

---

### 3. url() 处理

```css
.background {
  background: url('./image.png');
}
```

**css-loader** 会：
1. 解析 `url()` 路径
2. 转换为 `require('./image.png')`
3. 交由 Webpack 的资源模块处理

---

### 4. CSS Modules 命名规范

```javascript
// 开发环境：便于调试
localIdentName: '[path][name]__[local]--[hash:base64:5]'
// src/styles/Button.module.css → Button_button__a1b2c

// 生产环境：减小体积
localIdentName: '[hash:base64:8]'
// → _a1b2c3d4
```

---

## 🐛 常见问题

### Q1: 样式没有生效？

**原因**：Loader 顺序错误

```javascript
// ❌ 错误
use: ['css-loader', 'style-loader']

// ✅ 正确（从右到左执行）
use: ['style-loader', 'css-loader']
```

---

### Q2: CSS Modules 没有生效？

**原因**：文件名不匹配

```javascript
// ❌ 错误：文件名是 Button.css
import styles from './Button.css';

// ✅ 正确：文件名必须是 .module.css
import styles from './Button.module.css';
```

---

### Q3: HMR 不工作？

**原因**：生产环境使用了 MiniCssExtractPlugin

```javascript
// ✅ 解决：开发环境用 style-loader
const isDev = process.env.NODE_ENV === 'development';

use: [
  isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
  'css-loader'
]
```

---

## 🎯 实验任务

### 任务 1：修改样式，观察 HMR

1. 运行 `npm run dev`
2. 修改 `src/styles/main.css` 中的颜色
3. 观察页面是否自动更新

---

### 任务 2：对比开发和生产构建

1. 运行 `npm run dev`，查看 Elements 面板
2. 运行 `npm run build`，查看 `dist/` 目录
3. 对比 CSS 的加载方式

---

### 任务 3：创建自己的 CSS Module

1. 创建 `src/styles/MyComponent.module.css`
2. 定义样式
3. 在 `src/index.js` 中导入并使用
4. 观察类名的哈希化

---

## 📚 扩展阅读

- [css-loader 官方文档](https://webpack.js.org/loaders/css-loader/)
- [style-loader 官方文档](https://webpack.js.org/loaders/style-loader/)
- [CSS Modules 规范](https://github.com/css-modules/css-modules)
- [MiniCssExtractPlugin 文档](https://webpack.js.org/plugins/mini-css-extract-plugin/)

---

## 🎯 下一步

完成这个 Demo 后，继续学习：
- [Demo 2: 静态资源处理](../02-assets/) - 图片、字体等资源的处理

