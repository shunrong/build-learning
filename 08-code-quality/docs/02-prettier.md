# Prettier 详解

## 📖 什么是 Prettier？

**Prettier** 是一个代码格式化工具，自动统一代码风格。

---

## ESLint vs Prettier

| 特性 | ESLint | Prettier |
|------|--------|----------|
| **作用** | 代码质量 + 风格 | 只关注格式 |
| **配置** | 规则多，可配置性强 | 配置少，固执己见 |
| **修复** | 部分可修复 | 完全自动化 |
| **速度** | 较慢 | 很快 |

**结论**：ESLint 负责质量，Prettier 负责格式，两者配合使用。

---

## 快速开始

### 1. 安装

```bash
npm install -D prettier
```

### 2. 配置文件

```javascript
// .prettierrc.js
module.exports = {
  // 使用分号
  semi: true,
  
  // 使用单引号
  singleQuote: true,
  
  // 缩进 2 空格
  tabWidth: 2,
  
  // 使用空格而不是 tab
  useTabs: false,
  
  // 尾随逗号
  trailingComma: 'es5',
  
  // 每行最大长度
  printWidth: 80,
  
  // 箭头函数参数括号
  arrowParens: 'always',
  
  // 换行符
  endOfLine: 'lf'
};
```

### 3. 忽略文件

```.prettierignore
# .prettierignore
node_modules/
dist/
build/
coverage/
*.min.js
```

### 4. 使用

```bash
# 格式化
npx prettier --write "src/**/*.{js,jsx,json,css}"

# 检查（不修改）
npx prettier --check "src/**/*.{js,jsx,json,css}"

# package.json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{js,jsx,json,css}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,json,css}\""
  }
}
```

---

## 与 ESLint 集成

### 1. 安装插件

```bash
npm install -D eslint-config-prettier eslint-plugin-prettier
```

### 2. 配置 ESLint

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'airbnb-base',
    'prettier'  // 必须放最后！关闭与 Prettier 冲突的规则
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error'  // Prettier 错误作为 ESLint 错误显示
  }
};
```

---

## 编辑器集成（VS Code）

### 1. 安装插件

搜索并安装：`Prettier - Code formatter`

### 2. 配置

```json
// .vscode/settings.json
{
  // 保存时自动格式化
  "editor.formatOnSave": true,
  
  // 默认格式化工具
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  
  // 为特定文件类型配置
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## 🎯 推荐配置

```javascript
// .prettierrc.js
module.exports = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 80,
  arrowParens: 'always',
  endOfLine: 'lf'
};
```

---

**下一步**：学习 [Stylelint 详解](./03-stylelint.md)

