# React 基础集成

## 📖 快速开始

### 1. 安装依赖

```bash
# React
npm install react react-dom

# Babel
npm install -D @babel/preset-react

# TypeScript（可选）
npm install -D @types/react @types/react-dom
```

### 2. Babel 配置

```javascript
// .babelrc
{
  "presets": [
    "@babel/preset-env",
    [
      "@babel/preset-react",
      {
        "runtime": "automatic"  // React 17+ 新 JSX 转换
      }
    ],
    "@babel/preset-typescript"
  ]
}
```

### 3. Webpack 配置

```javascript
module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  }
};
```

### 4. tsconfig.json

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",  // React 17+
    "lib": ["ES2020", "DOM"]
  }
}
```

---

## JSX 转换

### 旧 JSX 转换（React 16）

```javascript
// 源代码
const App = () => <div>Hello</div>;

// 转换后
import React from 'react';
const App = () => React.createElement('div', null, 'Hello');
```

### 新 JSX 转换（React 17+）⭐️

```javascript
// 源代码
const App = () => <div>Hello</div>;

// 转换后（无需手动 import React）
import { jsx as _jsx } from 'react/jsx-runtime';
const App = () => _jsx('div', { children: 'Hello' });
```

---

## 🎯 推荐配置

```javascript
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  }
};
```

---

**下一步**：学习 [Fast Refresh](./02-fast-refresh.md)

