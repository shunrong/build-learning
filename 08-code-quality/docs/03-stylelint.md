# Stylelint 详解

## 📖 什么是 Stylelint？

**Stylelint** 是一个 CSS 代码检查工具，用于发现和修复 CSS 问题。

---

## 快速开始

### 1. 安装

```bash
# 基础安装
npm install -D stylelint stylelint-config-standard

# 支持 Sass/SCSS
npm install -D stylelint-config-standard-scss postcss-scss

# 支持 CSS-in-JS
npm install -D stylelint-config-styled-components
```

### 2. 配置文件

```javascript
// .stylelintrc.js
module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    // 颜色值小写
    'color-hex-case': 'lower',
    
    // 颜色值简写
    'color-hex-length': 'short',
    
    // 禁止空源
    'no-empty-source': null,
    
    // 选择器类名格式
    'selector-class-pattern': '^[a-z][a-zA-Z0-9]*$'
  }
};
```

### 3. 使用

```bash
# 检查
npx stylelint "src/**/*.css"

# 自动修复
npx stylelint "src/**/*.css" --fix

# package.json
{
  "scripts": {
    "lint:css": "stylelint \"src/**/*.css\"",
    "lint:css:fix": "stylelint \"src/**/*.css\" --fix"
  }
}
```

---

## Webpack 集成

```bash
npm install -D stylelint-webpack-plugin
```

```javascript
// webpack.config.js
const StylelintWebpackPlugin = require('stylelint-webpack-plugin');

module.exports = {
  plugins: [
    new StylelintWebpackPlugin({
      files: '**/*.css',
      fix: true,
      emitWarning: true
    })
  ]
};
```

---

## 🎯 推荐配置

```javascript
// .stylelintrc.js
module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    'color-hex-case': 'lower',
    'color-hex-length': 'short',
    'selector-class-pattern': null  // 允许任意类名
  }
};
```

---

**下一步**：学习 [Webpack 集成](./04-webpack-integration.md)

