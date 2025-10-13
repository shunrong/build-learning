# CSS 工程化完整示例

## 📝 简介

本 Demo 是一个综合性的 CSS 工程化示例，展示了现代前端 CSS 开发的最佳实践。

## 🎯 涵盖内容

1. **CSS Modules** - 局部作用域，避免样式冲突
2. **PostCSS** - Autoprefixer、嵌套语法、未来特性
3. **Sass/SCSS** - 变量、嵌套、混入
4. **CSS 优化** - 提取、压缩、PurgeCSS

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 开发模式

```bash
npm run dev
```

浏览器会自动打开 `http://localhost:xxxx`

### 3. 生产构建

```bash
npm run build
```

查看 `dist/` 目录，可以看到：
- CSS 被提取为独立文件
- CSS 被压缩
- 未使用的样式被删除（PurgeCSS）

## 📂 项目结构

```
01-css-engineering-complete/
├── src/
│   ├── components/
│   │   ├── Button.js
│   │   ├── Button.module.css      # CSS Modules
│   │   ├── Card.js
│   │   └── Card.module.css        # CSS Modules composes
│   ├── styles/
│   │   └── global.css             # 全局样式 + PostCSS
│   ├── index.html
│   └── index.js
├── webpack.config.js               # Webpack 配置
├── postcss.config.js               # PostCSS 配置
├── .babelrc                        # Babel 配置
└── package.json
```

## 🔧 核心配置

### 1. CSS Modules

```javascript
// webpack.config.js
{
  test: /\.module\.css$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        modules: {
          localIdentName: '[hash:base64:8]',
          exportLocalsConvention: 'camelCase'
        }
      }
    },
    'postcss-loader'
  ]
}
```

### 2. PostCSS

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-nested'),      // 嵌套语法
    require('postcss-preset-env'),  // 未来特性
    require('autoprefixer'),        // 自动前缀
    require('cssnano')              // 压缩
  ]
};
```

### 3. CSS 优化

```javascript
// webpack.config.js
plugins: [
  new MiniCssExtractPlugin({
    filename: 'css/[name].[contenthash:8].css'
  }),
  new PurgeCSSPlugin({
    paths: glob.sync('./src/**/*', { nodir: true })
  })
],
optimization: {
  minimizer: [new CssMinimizerPlugin()]
}
```

## 🎮 功能演示

### 1. CSS Modules

打开 DevTools → Elements，查看生成的类名：

```html
<!-- 源代码 -->
<button class="button primary">

<!-- 实际渲染 -->
<button class="Button_button__abc123 Button_primary__def456">
```

### 2. composes 组合

查看 `Card.module.css`：

```css
.baseCard {
  padding: 20px;
  /* ... */
}

.card {
  composes: baseCard;
  background: white;
}

.emphasizedCard {
  composes: baseCard;
  background: linear-gradient(...);
}
```

实际生成的类名：
```html
<div class="Card_baseCard__abc Card_card__def">
```

### 3. PostCSS 嵌套

查看 `global.css`：

```css
.app-title {
  color: white;
  
  &::after {
    content: ' 🎨';
  }
}

/* 编译后 */
.app-title {
  color: white;
}
.app-title::after {
  content: ' 🎨';
}
```

### 4. Autoprefixer

查看编译后的 CSS：

```css
/* 源代码 */
.box {
  display: flex;
  user-select: none;
}

/* 编译后（自动添加前缀） */
.box {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}
```

## 💡 关键知识点

### 1. CSS Modules 优势

- ✅ 避免全局作用域污染
- ✅ 明确的依赖关系
- ✅ 可以安全删除未使用的 CSS
- ✅ 使用 composes 复用样式

### 2. PostCSS 生态

- **postcss-nested**：支持 Sass 风格的嵌套
- **postcss-preset-env**：使用未来 CSS 特性
- **autoprefixer**：自动添加浏览器前缀
- **cssnano**：压缩 CSS

### 3. 优化效果

| 优化手段 | 效果 |
|---------|------|
| **MiniCssExtractPlugin** | CSS 提取为独立文件 |
| **CssMinimizerPlugin** | CSS 压缩 30-50% |
| **PurgeCSSPlugin** | 删除未使用样式 80-90% |
| **Autoprefixer** | 自动浏览器兼容 |

## 🔍 验证

### 1. 查看 CSS Modules

打开浏览器控制台：

```javascript
// 查看生成的类名
console.log(import('./components/Button.module.css'));
// { button: 'Button_button__abc123', primary: 'Button_primary__def456', ... }
```

### 2. 查看 PostCSS 效果

DevTools → Sources → dist/css/main.[hash].css

查看是否有：
- ✅ 浏览器前缀
- ✅ 嵌套语法已展开
- ✅ CSS 已压缩

### 3. 查看优化效果

运行 `npm run build`，查看 dist/ 目录：
- `css/main.[hash].css` - 压缩后的 CSS
- 文件体积应该很小（因为 PurgeCSS）

## ❓ 常见问题

### 1. CSS Modules 类名太长？

**答**：生产环境使用 `[hash:base64:8]` 生成短类名

### 2. PostCSS 插件顺序？

**答**：
1. postcss-import（处理 @import）
2. postcss-nested（展开嵌套）
3. autoprefixer（添加前缀）
4. cssnano（压缩）

### 3. PurgeCSS 删除了有用的样式？

**答**：使用 `safelist` 保护需要的类名

```javascript
new PurgeCSSPlugin({
  paths: glob.sync('./src/**/*'),
  safelist: ['active', 'show', /^ant-/]
})
```

## 🎯 学习目标验证

完成本 Demo 后，你应该能够：

- [ ] 理解 CSS Modules 的作用域隔离原理
- [ ] 会配置 PostCSS 插件链
- [ ] 理解 Autoprefixer 的工作原理
- [ ] 会使用 composes 组合样式
- [ ] 能够优化 CSS 打包体积
- [ ] 理解 CSS 工程化的最佳实践

## 🔗 相关文档

- [CSS Modules 详解](../../docs/01-css-modules.md)
- [PostCSS 生态](../../docs/02-postcss.md)
- [CSS 优化技巧](../../docs/04-css-optimization.md)

---

**Phase 07: CSS 工程化 Demo 已完成！** 🎉

