# PostCSS 生态

## 📖 什么是 PostCSS？

**PostCSS** 是一个用 JavaScript 转换 CSS 的工具，通过插件系统可以实现各种 CSS 处理功能。

### 核心概念

```
CSS 源码
    ↓
PostCSS Parser（解析为 AST）
    ↓
Plugin 1 → Plugin 2 → Plugin N（转换 AST）
    ↓
PostCSS Stringifier（生成 CSS）
    ↓
输出 CSS
```

---

## PostCSS vs Sass/Less

| 特性 | PostCSS | Sass/Less |
|------|---------|-----------|
| **定位** | CSS 转换工具 | CSS 预处理器 |
| **语法** | 标准 CSS + 插件扩展 | 自定义语法 |
| **扩展性** | ⭐⭐⭐⭐⭐ 插件生态 | ⭐⭐⭐ 功能固定 |
| **性能** | ⚡⚡⚡⚡⚡ 快 | ⚡⚡⚡ 较慢 |
| **学习成本** | ⭐⭐ 低 | ⭐⭐⭐⭐ 高 |

**结论**：PostCSS 可以和 Sass/Less 配合使用，不是替代关系。

---

## 核心插件

### 1. Autoprefixer ⭐⭐⭐⭐⭐

**自动添加浏览器前缀**

```css
/* 输入 */
.container {
  display: flex;
  user-select: none;
}

/* 输出 */
.container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}
```

### 2. postcss-preset-env ⭐⭐⭐⭐⭐

**使用未来的 CSS 特性**

```css
/* 输入 */
.button {
  color: color-mod(blue alpha(50%));
  &:hover {
    color: blue;
  }
}

/* 输出（转换为当前浏览器支持的语法） */
.button {
  color: rgba(0, 0, 255, 0.5);
}
.button:hover {
  color: blue;
}
```

### 3. cssnano ⭐⭐⭐⭐⭐

**CSS 压缩**

```css
/* 输入 */
.container {
  background: #ffffff;
  padding: 10px 10px 10px 10px;
}

/* 输出 */
.container{background:#fff;padding:10px}
```

### 4. postcss-nested ⭐⭐⭐⭐

**嵌套语法**

```css
/* 输入 */
.card {
  .title {
    font-size: 20px;
  }
  &:hover {
    opacity: 0.8;
  }
}

/* 输出 */
.card .title {
  font-size: 20px;
}
.card:hover {
  opacity: 0.8;
}
```

---

## Webpack 配置

### 基础配置

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default'
    })
  ]
};

// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'  // 添加 postcss-loader
        ]
      }
    ]
  }
};
```

### 完整配置

```javascript
// postcss.config.js
module.exports = ({ env }) => ({
  plugins: [
    require('postcss-import'),        // @import 支持
    require('postcss-nested'),        // 嵌套语法
    require('postcss-preset-env')({   // 未来特性
      stage: 3,
      features: {
        'nesting-rules': true
      }
    }),
    require('autoprefixer'),          // 自动前缀
    env === 'production' && require('cssnano')({  // 生产压缩
      preset: ['default', {
        discardComments: {
          removeAll: true
        }
      }]
    })
  ].filter(Boolean)
});
```

---

## 🎯 推荐配置

```bash
npm install -D postcss postcss-loader autoprefixer cssnano postcss-preset-env
```

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    'autoprefixer',
    'postcss-preset-env',
    process.env.NODE_ENV === 'production' && 'cssnano'
  ].filter(Boolean)
};
```

---

**下一步**：学习 [Tailwind CSS](./03-tailwind-css.md)

