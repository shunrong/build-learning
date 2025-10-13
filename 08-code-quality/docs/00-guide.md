# Phase 08: 代码质量工程化

## 🎯 学习目标

通过这个阶段，你将：
1. **掌握 ESLint 的配置和使用**
2. **掌握 Prettier 的配置和集成**
3. **掌握 Stylelint 的配置和使用**
4. **学会在 Webpack 中集成代码质量工具**
5. **建立完整的代码质量保障体系**

---

## 📚 学习路径

```
理论学习（3-4小时）
    ↓
1. 阅读 docs/01-eslint.md              (60分钟) - ESLint
2. 阅读 docs/02-prettier.md            (45分钟) - Prettier
3. 阅读 docs/03-stylelint.md           (45分钟) - Stylelint
4. 阅读 docs/04-webpack-integration.md (60分钟) - Webpack 集成
    ↓
实践体验（3-4小时）
    ↓
5. 运行 demos/01-code-quality-complete/ (2-3小时)
    ↓
深入实践（2-3小时）
    ↓
6. 配置自己的代码质量方案              (1-2小时)
7. 解决实际问题                        (1小时)
    ↓
总结反思（30分钟）
```

---

## 📖 文档列表

### 1. [ESLint 详解](./01-eslint.md)
- 什么是 ESLint？
- 核心概念（规则、插件、配置）
- 常用配置（Airbnb、Standard）
- 自定义规则
- Webpack 集成
- 最佳实践

### 2. [Prettier 详解](./02-prettier.md)
- 什么是 Prettier？
- 与 ESLint 的区别
- 核心配置
- 与 ESLint 集成
- 编辑器集成
- 最佳实践

### 3. [Stylelint 详解](./03-stylelint.md)
- 什么是 Stylelint？
- 核心配置
- 常用规则
- 与预处理器集成
- Webpack 集成
- 最佳实践

### 4. [Webpack 集成](./04-webpack-integration.md)
- ESLintWebpackPlugin
- StylelintWebpackPlugin
- 开发体验优化
- 性能优化
- 完整配置示例

---

## 🎮 Demo

### [代码质量完整示例](../demos/01-code-quality-complete/)

**涵盖内容**：
- ✅ ESLint（JavaScript 代码检查）
- ✅ Prettier（代码格式化）
- ✅ Stylelint（CSS 代码检查）
- ✅ Webpack 集成
- ✅ 编辑器集成（VS Code）
- ✅ 自动修复

**运行方式**：
```bash
cd demos/01-code-quality-complete
npm install
npm run dev      # 开发模式（实时检查）
npm run lint     # 手动检查所有文件
npm run lint:fix # 自动修复问题
```

---

## ✅ 检验标准

完成这个阶段后，你应该能够：

### 理论层面
- [ ] 理解 ESLint、Prettier、Stylelint 的作用
- [ ] 理解 Linter 和 Formatter 的区别
- [ ] 掌握配置文件的优先级
- [ ] 理解规则的严重级别
- [ ] 能够自定义规则

### 实践层面
- [ ] 能配置 ESLint
- [ ] 能配置 Prettier
- [ ] 能配置 Stylelint
- [ ] 能在 Webpack 中集成
- [ ] 能在编辑器中集成
- [ ] 能解决规则冲突

### 面试层面
1. **ESLint 和 Prettier 的区别？**
2. **如何解决 ESLint 和 Prettier 的冲突？**
3. **如何自定义 ESLint 规则？**
4. **Stylelint 能检查什么？**
5. **如何在团队中推行代码规范？**

---

## 🎯 核心知识点

### 1. ESLint、Prettier、Stylelint 对比

| 工具 | 作用 | 关注点 | 能否自动修复 |
|------|------|--------|--------------|
| **ESLint** | JavaScript Linter | 代码质量 + 风格 | ✅ 部分可以 |
| **Prettier** | 代码格式化工具 | 代码风格 | ✅ 完全可以 |
| **Stylelint** | CSS Linter | CSS 质量 + 风格 | ✅ 部分可以 |

### 2. Linter vs Formatter

```
Linter（ESLint/Stylelint）
  - 检查代码质量问题
  - 检查代码风格问题
  - 可配置规则
  - 部分可自动修复

Formatter（Prettier）
  - 只关注代码格式
  - 自动格式化代码
  - 配置项少
  - 完全自动化
```

### 3. 工作流程

```
1. 编写代码
    ↓
2. 保存文件
    ↓
3. Prettier 格式化（编辑器）
    ↓
4. ESLint 检查（编辑器/Webpack）
    ↓
5. Stylelint 检查（编辑器/Webpack）
    ↓
6. 显示错误/警告
    ↓
7. 自动修复或手动修复
```

---

## 💡 最佳实践

### 1. 推荐配置组合

```json
// package.json
{
  "devDependencies": {
    // ESLint
    "eslint": "^8.x",
    "eslint-config-airbnb-base": "^15.x",
    "eslint-plugin-import": "^2.x",
    
    // Prettier
    "prettier": "^3.x",
    "eslint-config-prettier": "^9.x",
    "eslint-plugin-prettier": "^5.x",
    
    // Stylelint
    "stylelint": "^15.x",
    "stylelint-config-standard": "^34.x"
  }
}
```

### 2. 配置文件

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'airbnb-base',
    'prettier'  // 必须放最后，关闭与 Prettier 冲突的规则
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error'
  }
};

// .prettierrc.js
module.exports = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5'
};

// .stylelintrc.js
module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    'color-hex-length': 'short'
  }
};
```

### 3. Webpack 集成

```javascript
// webpack.config.js
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const StylelintWebpackPlugin = require('stylelint-webpack-plugin');

module.exports = {
  plugins: [
    new ESLintWebpackPlugin({
      extensions: ['js', 'jsx'],
      fix: true  // 自动修复
    }),
    new StylelintWebpackPlugin({
      files: '**/*.css',
      fix: true
    })
  ]
};
```

---

## 🔗 相关资源

- [ESLint 官方文档](https://eslint.org/)
- [Prettier 官方文档](https://prettier.io/)
- [Stylelint 官方文档](https://stylelint.io/)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

---

**准备好了吗？让我们开始代码质量工程化的学习之旅！** 🔍

