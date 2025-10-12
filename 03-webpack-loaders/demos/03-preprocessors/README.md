# Demo 3: CSS 预处理器（Sass/Less）

## 📚 学习目标

- 理解 CSS 预处理器的作用和优势
- 掌握 Sass/SCSS 的使用
- 掌握 Less 的使用
- 理解 PostCSS 和 Autoprefixer
- 理解完整的 Loader 链执行流程

---

## 🎯 核心概念

### 1. CSS 预处理器

**作用**：扩展 CSS 功能，增加编程能力

**主流预处理器**：
- **Sass/SCSS**：最流行，功能最强大
- **Less**：语法简洁，易上手
- **Stylus**：灵活，但使用较少

**共同特性**：
- 变量
- 嵌套
- Mixin（混入）
- 函数
- 导入
- 继承

---

### 2. Sass vs SCSS

```scss
// SCSS 语法（推荐）
$primary-color: #667eea;

.button {
  background: $primary-color;
  
  &:hover {
    background: darken($primary-color, 10%);
  }
}
```

```sass
// Sass 语法（缩进式，不常用）
$primary-color: #667eea

.button
  background: $primary-color
  
  &:hover
    background: darken($primary-color, 10%)
```

**推荐使用 SCSS**：
- ✅ 兼容 CSS 语法
- ✅ 更易迁移
- ✅ 更流行

---

### 3. PostCSS

**作用**：使用 JavaScript 转换 CSS

**常用插件**：
- **autoprefixer**：自动添加浏览器前缀
- **postcss-preset-env**：使用未来 CSS 特性
- **cssnano**：压缩 CSS

**示例**：
```css
/* 输入 */
.container {
  display: flex;
}

/* 输出（autoprefixer） */
.container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
```

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

**观察点**：
1. 打开开发者工具 → Elements
2. 查看 `<style>` 标签中的 CSS
3. 观察自动添加的浏览器前缀

**示例**：
```css
/* 原始 CSS */
display: flex;

/* 编译后（带前缀） */
display: -webkit-box;
display: -ms-flexbox;
display: flex;
```

---

### 3. 修改 Sass/Less，观察 HMR

修改 `src/styles/sass-features.scss`：

```scss
$color-primary: #f093fb;  // 改变颜色
```

**观察**：
- 页面无需刷新
- 样式立即更新
- 控制台输出 "Sass HMR 更新！"

---

### 4. 生产构建

```bash
npm run build
```

查看 `dist/` 目录：

```
dist/
├── css/
│   └── main.abc123.css  # CSS 独立文件
├── js/
│   └── main.def456.js
└── index.html
```

查看 `dist/css/main.*.css`，观察：
- Sass/Less 已编译为 CSS
- 浏览器前缀已添加
- CSS 已压缩（production 模式）

---

## 📊 Loader 链详解

### 完整执行流程

```
style.scss
    ↓ sass-loader (Sass → CSS)
style.css
    ↓ postcss-loader (添加前缀)
prefixed.css
    ↓ css-loader (CSS → JS 模块)
JS module
    ↓ style-loader (注入 DOM)
<style> 标签
```

---

### webpack.config.js

```javascript
{
  test: /\.scss$/,
  use: [
    // 4. 注入 DOM（最后执行）
    'style-loader',
    
    // 3. 解析 CSS
    {
      loader: 'css-loader',
      options: {
        importLoaders: 2  // @import 的文件也要经过后面 2 个 Loader
      }
    },
    
    // 2. 添加浏览器前缀
    'postcss-loader',
    
    // 1. 编译 Sass（最先执行）
    'sass-loader'
  ]
}
```

---

### importLoaders 详解

```javascript
{
  loader: 'css-loader',
  options: {
    importLoaders: 2  // postcss-loader + sass-loader
  }
}
```

**作用**：确保 `@import` 的文件也经过所有 Loader

**示例**：
```scss
// main.scss
@import './base.scss';

.container {
  color: red;
}
```

**不配置 importLoaders**：
- `main.scss` 经过：sass-loader → postcss-loader → css-loader
- `base.scss` 只经过：css-loader ❌

**配置 importLoaders: 2**：
- `main.scss` 经过：sass-loader → postcss-loader → css-loader
- `base.scss` 也经过：sass-loader → postcss-loader → css-loader ✅

---

## 🔍 Sass 特性演示

### 1. 变量

```scss
// 定义变量
$primary-color: #667eea;
$spacing: 20px;

// 使用变量
.button {
  background: $primary-color;
  padding: $spacing;
}
```

---

### 2. 嵌套

```scss
.nav {
  background: white;
  
  // 嵌套选择器
  ul {
    list-style: none;
    
    li {
      display: inline-block;
      
      // 父选择器 &
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
```

**编译后**：
```css
.nav { background: white; }
.nav ul { list-style: none; }
.nav ul li { display: inline-block; }
.nav ul li:hover { background: #f5f5f5; }
```

---

### 3. Mixin（混入）

```scss
// 定义 Mixin
@mixin button-style($bg-color) {
  padding: 10px 20px;
  background: $bg-color;
  border-radius: 6px;
  
  &:hover {
    background: darken($bg-color, 10%);
  }
}

// 使用 Mixin
.primary-btn {
  @include button-style(#667eea);
}

.secondary-btn {
  @include button-style(#6c757d);
}
```

---

### 4. 函数

```scss
// 内置函数
$base-color: #667eea;

.lighten-box {
  background: lighten($base-color, 10%);  // 变亮
}

.darken-box {
  background: darken($base-color, 10%);  // 变暗
}

.transparentize-box {
  background: transparentize($base-color, 0.5);  // 半透明
}
```

---

### 5. 循环和条件

```scss
// 循环
@for $i from 1 through 3 {
  .item-#{$i} {
    width: 100px * $i;
  }
}

// 编译后
.item-1 { width: 100px; }
.item-2 { width: 200px; }
.item-3 { width: 300px; }
```

---

## 🔍 Less 特性演示

### 1. 变量（使用 @）

```less
// 定义变量
@primary-color: #667eea;
@spacing: 20px;

// 使用变量
.button {
  background: @primary-color;
  padding: @spacing;
}
```

---

### 2. Mixin

```less
// 定义 Mixin
.rounded() {
  border-radius: 8px;
}

.shadowed(@offset: 4px) {
  box-shadow: 0 @offset (@offset * 2) rgba(0, 0, 0, 0.1);
}

// 使用 Mixin
.card {
  .rounded();
  .shadowed(6px);
}
```

---

### 3. 嵌套和父选择器

```less
.button {
  padding: 10px;
  
  // 父选择器 &
  &:hover {
    background: #f5f5f5;
  }
  
  // & 连接
  &-primary {
    background: blue;
  }
  
  &-secondary {
    background: gray;
  }
}
```

**编译后**：
```css
.button { padding: 10px; }
.button:hover { background: #f5f5f5; }
.button-primary { background: blue; }
.button-secondary { background: gray; }
```

---

## 🔧 PostCSS 配置

### postcss.config.js

```javascript
module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: [
        '> 1%',              // 市场份额 > 1%
        'last 2 versions',   // 最新 2 个版本
        'not dead'           // 还在维护的浏览器
      ]
    })
  ]
};
```

---

### 自动添加的前缀

| CSS 属性 | 添加的前缀 |
|---------|----------|
| `display: flex` | `-webkit-box`, `-ms-flexbox` |
| `display: grid` | `-ms-grid` |
| `user-select` | `-webkit-user-select`, `-moz-user-select`, `-ms-user-select` |
| `transform` | `-webkit-transform`, `-ms-transform` |
| `appearance` | `-webkit-appearance`, `-moz-appearance` |

---

## 🐛 常见问题

### Q1: Sass 编译失败？

**错误**：`Error: Cannot find module 'sass'`

**解决**：
```bash
npm install -D sass sass-loader
```

---

### Q2: Less 编译失败？

**错误**：`Error: Cannot find module 'less'`

**解决**：
```bash
npm install -D less less-loader
```

---

### Q3: Autoprefixer 没有生效？

**原因**：缺少 `postcss.config.js`

**解决**：
1. 创建 `postcss.config.js`
2. 配置 `autoprefixer`
3. 在 webpack 中添加 `postcss-loader`

---

### Q4: @import 的文件没有经过预处理？

**原因**：`importLoaders` 配置不当

**解决**：
```javascript
{
  loader: 'css-loader',
  options: {
    importLoaders: 2  // sass/less-loader + postcss-loader
  }
}
```

---

## 💡 最佳实践

### 1. 选择预处理器

| 特性 | Sass | Less |
|------|------|------|
| **功能** | 最强大 | 中等 |
| **学习曲线** | 中等 | 简单 |
| **生态** | 最丰富 | 丰富 |
| **推荐场景** | 大型项目 | 中小型项目 |

**推荐**：优先选择 Sass（SCSS 语法）

---

### 2. Loader 顺序

```javascript
// ✅ 正确
use: [
  'style-loader',
  'css-loader',
  'postcss-loader',
  'sass-loader'
]

// ❌ 错误
use: [
  'sass-loader',
  'postcss-loader',
  'css-loader',
  'style-loader'
]
```

---

### 3. 启用 Source Map

```javascript
{
  loader: 'sass-loader',
  options: {
    sourceMap: true  // 便于调试
  }
}
```

---

### 4. 配置 importLoaders

```javascript
{
  loader: 'css-loader',
  options: {
    importLoaders: 2  // 确保 @import 的文件也经过所有 Loader
  }
}
```

---

## 🎯 实验任务

### 任务 1：Sass 变量

1. 在 `sass-features.scss` 中定义新变量
2. 使用变量定义颜色、间距等
3. 观察编译结果

---

### 任务 2：创建自己的 Mixin

1. 定义一个 Mixin（如 `card-style`）
2. 在多个地方使用
3. 观察代码复用效果

---

### 任务 3：观察 Autoprefixer

1. 打开开发者工具
2. 查看 CSS 中的 `display: flex`
3. 确认是否添加了浏览器前缀

---

## 📚 扩展阅读

- [Sass 官方文档](https://sass-lang.com/)
- [Less 官方文档](https://lesscss.org/)
- [PostCSS 官方文档](https://postcss.org/)
- [Autoprefixer 官方文档](https://github.com/postcss/autoprefixer)

---

## 🎯 下一步

完成这个 Demo 后，继续学习：
- [Demo 4: 手写自定义 Loader](../04-custom-loader/) - 实现自己的 Loader

