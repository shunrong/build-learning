# 代码质量工程化完整示例

## 📝 简介

本 Demo 展示如何在 Webpack 项目中集成 ESLint、Prettier 和 Stylelint，建立完整的代码质量保障体系。

## 🎯 涵盖内容

1. **ESLint** - JavaScript 代码检查（Airbnb 规范）
2. **Prettier** - 代码自动格式化
3. **Stylelint** - CSS 代码检查
4. **Webpack 集成** - 实时检查和自动修复
5. **编辑器集成** - VS Code 配置

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 开发模式

```bash
npm run dev
```

浏览器会自动打开，实时检查代码质量。

### 3. 代码检查

```bash
# 检查所有代码
npm run lint

# 自动修复问题
npm run lint:fix

# 格式化所有代码
npm run format
```

### 4. 生产构建

```bash
npm run build
```

生产环境会进行严格检查，有错误时会阻塞构建。

## 📂 项目结构

```
01-code-quality-complete/
├── src/
│   ├── components/
│   │   └── button.js
│   ├── utils.js
│   ├── styles.css
│   ├── index.html
│   └── index.js
├── .eslintrc.js          # ESLint 配置
├── .prettierrc.js        # Prettier 配置
├── .stylelintrc.js       # Stylelint 配置
├── .babelrc              # Babel 配置
├── webpack.config.js     # Webpack 配置
└── package.json
```

## 🔧 核心配置

### 1. ESLint 配置

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'airbnb-base',  // Airbnb 规范
    'prettier'      // 关闭与 Prettier 冲突的规则
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error'  // Prettier 错误
  }
};
```

### 2. Prettier 配置

```javascript
// .prettierrc.js
module.exports = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5'
};
```

### 3. Stylelint 配置

```javascript
// .stylelintrc.js
module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    'color-hex-case': 'lower',
    'color-hex-length': 'short'
  }
};
```

### 4. Webpack 集成

```javascript
// webpack.config.js
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const StylelintWebpackPlugin = require('stylelint-webpack-plugin');

module.exports = {
  plugins: [
    new ESLintWebpackPlugin({
      fix: true  // 自动修复
    }),
    new StylelintWebpackPlugin({
      fix: true
    })
  ]
};
```

## 🎮 功能演示

### 1. 实时代码检查

在开发模式下，代码保存后会自动检查：
- ESLint 检查 JavaScript 代码
- Stylelint 检查 CSS 代码
- 错误/警告显示在控制台和浏览器

### 2. 自动修复

运行 `npm run lint:fix` 可以自动修复大部分问题：
- 格式化代码
- 修复简单的 ESLint 错误
- 修复 CSS 格式问题

### 3. 生产环境严格检查

生产构建时会进行严格检查，有错误会阻塞构建。

## 💡 编辑器集成（VS Code）

### 1. 安装扩展

- ESLint
- Prettier - Code formatter
- Stylelint

### 2. 配置

创建 `.vscode/settings.json`：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## 🔍 工作流程

```
1. 编写代码
    ↓
2. 保存文件
    ↓
3. Prettier 自动格式化（编辑器）
    ↓
4. ESLint 检查 JS（Webpack）
    ↓
5. Stylelint 检查 CSS（Webpack）
    ↓
6. 显示错误/警告
    ↓
7. 自动修复 or 手动修复
    ↓
8. 提交代码
```

## ✅ 验证清单

完成本 Demo 后，请确认：

- [ ] 理解 ESLint、Prettier、Stylelint 的作用
- [ ] 会配置 ESLint（Airbnb 规范）
- [ ] 会配置 Prettier
- [ ] 会配置 Stylelint
- [ ] 会在 Webpack 中集成
- [ ] 会在编辑器中集成
- [ ] 能够自动修复常见问题

## 🎯 最佳实践

1. ✅ 使用成熟的规范（Airbnb、Standard）
2. ✅ ESLint + Prettier 配合使用
3. ✅ 在 Webpack 中集成实时检查
4. ✅ 在编辑器中配置保存时自动修复
5. ✅ 开发环境显示警告，生产环境严格检查
6. ✅ 使用 Git Hooks 在提交前检查（下一阶段）

---

**Phase 08: 代码质量工程化 Demo 已完成！** 🎉

