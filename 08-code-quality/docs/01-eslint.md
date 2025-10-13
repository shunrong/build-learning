# ESLint 详解

## 📖 什么是 ESLint？

**ESLint** 是一个 JavaScript 代码检查工具，用于发现和修复代码问题。

---

## 核心概念

### 1. 规则（Rules）

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'no-console': 'error',           // 禁止 console
    'no-unused-vars': 'warn',        // 未使用变量警告
    'semi': ['error', 'always'],     // 必须使用分号
    'quotes': ['error', 'single']    // 必须使用单引号
  }
};
```

**严重级别**：
- `'off'` 或 `0` - 关闭规则
- `'warn'` 或 `1` - 警告
- `'error'` 或 `2` - 错误

### 2. 扩展配置（Extends）

```javascript
module.exports = {
  extends: [
    'eslint:recommended',    // ESLint 推荐规则
    'airbnb-base',          // Airbnb 规范
    'plugin:react/recommended',  // React 规则
    'prettier'              // 关闭与 Prettier 冲突的规则
  ]
};
```

**常用配置**：
- `eslint:recommended` - ESLint 官方推荐
- `airbnb-base` - Airbnb 规范（最流行）⭐️
- `standard` - Standard 规范
- `google` - Google 规范

### 3. 插件（Plugins）

```javascript
module.exports = {
  plugins: ['react', 'import', 'prettier'],
  rules: {
    'react/prop-types': 'error',
    'import/no-unresolved': 'error',
    'prettier/prettier': 'error'
  }
};
```

---

## 快速开始

### 1. 安装

```bash
# 基础安装
npm install -D eslint

# Airbnb 规范（推荐）
npm install -D eslint-config-airbnb-base eslint-plugin-import

# 与 Prettier 集成
npm install -D eslint-config-prettier eslint-plugin-prettier prettier
```

### 2. 配置文件

```javascript
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'airbnb-base',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn'
  }
};
```

### 3. 使用

```bash
# 检查
npx eslint src/**/*.js

# 自动修复
npx eslint src/**/*.js --fix

# package.json
{
  "scripts": {
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix"
  }
}
```

---

## Webpack 集成

```bash
npm install -D eslint-webpack-plugin
```

```javascript
// webpack.config.js
const ESLintWebpackPlugin = require('eslint-webpack-plugin');

module.exports = {
  plugins: [
    new ESLintWebpackPlugin({
      extensions: ['js', 'jsx'],
      fix: true,  // 自动修复
      emitWarning: true,
      emitError: true,
      failOnError: false  // 开发环境不阻塞构建
    })
  ]
};
```

---

## 🎯 推荐配置

```javascript
// .eslintrc.js - 完整配置
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'airbnb-base',
    'prettier'
  ],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Prettier
    'prettier/prettier': 'error',
    
    // 开发时放宽
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    
    // 根据团队调整
    'import/prefer-default-export': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  }
};
```

---

**下一步**：学习 [Prettier 详解](./02-prettier.md)

