# Webpack 集成

## 📖 完整集成方案

将 ESLint、Prettier、Stylelint 集成到 Webpack 中。

---

## 完整配置

### 1. 安装依赖

```bash
# ESLint
npm install -D eslint eslint-webpack-plugin
npm install -D eslint-config-airbnb-base eslint-plugin-import

# Prettier
npm install -D prettier eslint-config-prettier eslint-plugin-prettier

# Stylelint
npm install -D stylelint stylelint-webpack-plugin stylelint-config-standard
```

### 2. webpack.config.js

```javascript
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const StylelintWebpackPlugin = require('stylelint-webpack-plugin');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
    plugins: [
      // ESLint
      new ESLintWebpackPlugin({
        extensions: ['js', 'jsx'],
        fix: true,  // 自动修复
        emitWarning: isDev,
        emitError: !isDev,
        failOnError: !isDev  // 生产环境失败时阻塞构建
      }),
      
      // Stylelint
      new StylelintWebpackPlugin({
        files: '**/*.css',
        fix: true,
        emitWarning: isDev,
        emitError: !isDev
      })
    ]
  };
};
```

### 3. .eslintrc.js

```javascript
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
    'prettier/prettier': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn'
  }
};
```

### 4. .prettierrc.js

```javascript
module.exports = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5'
};
```

### 5. .stylelintrc.js

```javascript
module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    'color-hex-case': 'lower'
  }
};
```

### 6. package.json scripts

```json
{
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production",
    "lint": "npm run lint:js && npm run lint:css",
    "lint:js": "eslint src/**/*.js",
    "lint:css": "stylelint src/**/*.css",
    "lint:fix": "npm run lint:js -- --fix && npm run lint:css -- --fix",
    "format": "prettier --write \"src/**/*.{js,css,json}\""
  }
}
```

---

## 🎯 完整工作流

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
8. 提交代码（下一阶段：Git Hooks）
```

---

**Phase 08 文档已完成！** 🎉

